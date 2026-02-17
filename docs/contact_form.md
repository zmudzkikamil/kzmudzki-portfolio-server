# Contact Form — How It Works

This document explains everything built for the contact form feature, from first principles.
No prior backend knowledge assumed.

---

## Table of Contents

1. [The big picture — what happens when someone submits the form](#1-the-big-picture)
2. [NestJS concepts you need to know](#2-nestjs-concepts-you-need-to-know)
3. [The Module — contact.module.ts](#3-the-module)
4. [The Entity — contact.entity.ts](#4-the-entity)
5. [The DTO — create-contact.dto.ts](#5-the-dto)
6. [The Controller — contact.controller.ts](#6-the-controller)
7. [The Service — contact.service.ts](#7-the-service)
8. [How app.module.ts was updated](#8-how-appmodulets-was-updated)
9. [How main.ts was updated](#9-how-maints-was-updated)
10. [Security features explained](#10-security-features-explained)
11. [Environment variables](#11-environment-variables)

---

## 1. The Big Picture

When a visitor fills in the contact form and hits Send, this is the exact chain of events:

```
Browser (React)
    │  POST /contact  { name, email, message }
    ▼
ContactController        ← receives the HTTP request
    │  validates the body using the DTO
    ▼
ContactService.submit()  ← all the real logic lives here
    │
    ├─ 1. Check rate limit (max 5 from same IP in last hour)
    │       └─ queries contact_submissions table in SQLite
    │
    ├─ 2. Strip HTML from name and message
    │
    ├─ 3. Save row to contact_submissions with status = 'pending'
    │
    ├─ 4. Send email via Resend API
    │       ├─ success → update status to 'sent', return { success: true }
    │       └─ failure → update status to 'failed', return HTTP 500
    ▼
Browser receives response
```

---

## 2. NestJS Concepts You Need to Know

### What is a decorator?

A decorator is a special syntax that starts with `@` and sits directly above a class, method, or property.
It *annotates* that thing — it tells NestJS (or TypeORM) to treat it in a specific way.

```typescript
@Controller('contact')   // ← this is a decorator
export class ContactController { ... }
```

Think of decorators like labels you stick on things. `@Controller('contact')` is saying:
*"This class is a controller and it handles requests that start with /contact."*

### What is Dependency Injection (DI)?

Dependency Injection means: instead of creating objects yourself inside a class, you *ask* NestJS to create them and *inject* them into your constructor.

Without DI (you'd have to do this yourself):
```typescript
// Bad — you create everything manually
class ContactController {
  private service = new ContactService(new Repository(...), new ConfigService(...));
}
```

With DI (NestJS does it for you):
```typescript
// Good — NestJS handles the wiring
class ContactController {
  constructor(private contactService: ContactService) {}
  //          ^^^ NestJS sees this and automatically creates + injects ContactService
}
```

This is why every NestJS class is decorated with `@Injectable()`, `@Controller()`, etc. — it registers them with NestJS's DI system so they can be injected into other classes.

### What is the request lifecycle?

Every HTTP request goes through this pipeline before it reaches your code:

```
HTTP Request
    ▼
Middleware        (global setup, e.g. CORS, logging)
    ▼
Guards           (auth checks — not used here)
    ▼
Interceptors     (transform request/response — not used here)
    ▼
Pipes            (ValidationPipe lives here — validates the DTO)
    ▼
Controller       (routes to the right method)
    ▼
Service          (business logic)
    ▼
HTTP Response
```

---

## 3. The Module

**File:** [src/contact/contact.module.ts](../src/contact/contact.module.ts)

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([ContactSubmission])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
```

A **module** is a box that groups related things together. Every feature in this codebase has its own module (CertsModule, ProjectsModule, etc.).

The `@Module` decorator accepts an object with three arrays:

| Array | What goes here | Why |
|---|---|---|
| `imports` | Other modules this module needs | We need TypeORM to work with the database |
| `controllers` | Classes that handle HTTP routes | ContactController handles POST /contact |
| `providers` | Services and other injectable classes | ContactService contains the logic |

**`TypeOrmModule.forFeature([ContactSubmission])`** — this is how you tell TypeORM:
*"Inside this module, I want to be able to inject the repository for ContactSubmission."*
It makes `Repository<ContactSubmission>` available for injection in ContactService.

---

## 4. The Entity

**File:** [src/contact/contact.entity.ts](../src/contact/contact.entity.ts)

```typescript
@Entity('contact_submissions')
export class ContactSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'text' })
  message: string;

  @Column()
  ip_address: string;

  @CreateDateColumn()
  submitted_at: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'sent' | 'failed';
}
```

An **entity** is a TypeScript class that maps directly to a database table.
TypeORM reads the decorators and creates/maintains the SQL table for you.

Because `synchronize: true` is set in [src/app.module.ts](../src/app.module.ts), TypeORM automatically creates this table in `database.sqlite` the first time the server starts. You never write `CREATE TABLE` SQL manually.

### Decorator breakdown

| Decorator | What it does |
|---|---|
| `@Entity('contact_submissions')` | Creates a table named `contact_submissions` |
| `@PrimaryGeneratedColumn('uuid')` | Auto-generates a unique ID like `a3f8b2c1-...` for each row |
| `@Column()` | Maps this property to a regular text column |
| `@Column({ type: 'text' })` | Same, but `text` allows unlimited length (vs the default `varchar(255)`) |
| `@Column({ default: 'pending' })` | Column has a default value if none is provided |
| `@CreateDateColumn()` | Automatically sets this to the current timestamp when a row is inserted |

### Why UUID instead of a plain number ID?

Most other entities here use `@PrimaryGeneratedColumn()` which produces `1, 2, 3, ...`.
UUIDs (`@PrimaryGeneratedColumn('uuid')`) produce random strings like `a3f8b2c1-4e2a-...`.

For contact submissions, UUIDs are better because:
- You can't guess the ID of another submission by incrementing a number
- If you ever shard the database across multiple servers, IDs won't collide

### The `status` field

`status: 'pending' | 'sent' | 'failed'` uses a TypeScript **union type** — the value must be one of exactly these three strings.

This lets you track the email delivery lifecycle:
- `pending` — saved to DB, email not sent yet
- `sent` — email delivered successfully
- `failed` — Resend API returned an error

---

## 5. The DTO

**File:** [src/contact/dto/create-contact.dto.ts](../src/contact/dto/create-contact.dto.ts)

```typescript
export class CreateContactDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(254)
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  @MaxLength(2000)
  @Transform(({ value }) => value?.trim())
  message: string;
}
```

**DTO** stands for *Data Transfer Object*. It describes the shape and rules for data coming *into* your API.

### Why not just use the entity directly?

You could accept a raw `any` object and pass it straight to the database, but that's dangerous:
- A user could send `{ name: '', email: 'notanemail', message: 'x'.repeat(999999) }`
- Or they could try sending `{ id: 'hacked', status: 'sent' }` to overwrite fields they shouldn't touch

The DTO is a separate class that only declares the fields you actually want to accept.

### How does validation work?

The `ValidationPipe` (registered globally in `main.ts`) intercepts every request.
Before your controller method runs, it:
1. Takes the raw JSON body from the request
2. Tries to fit it into the DTO class
3. Runs every `class-validator` decorator (`@IsString`, `@IsEmail`, etc.)
4. If anything fails → automatically returns HTTP 400 with a descriptive error message
5. If everything passes → your controller receives a clean, typed object

`whitelist: true` in the ValidationPipe means any extra fields the user sends (not declared in the DTO) are silently stripped. So if someone sends `{ name: 'X', secretField: 'hack' }`, the `secretField` simply disappears before reaching your code.

### The `@Transform` decorator

`@Transform(({ value }) => value?.trim())` runs *before* validation. It modifies the value — in this case, removing leading/trailing whitespace.

So `"  hello  "` becomes `"hello"` before `@IsNotEmpty` checks it. Without this, `"   "` (spaces only) would pass `@IsNotEmpty` even though it's functionally empty.

---

## 6. The Controller

**File:** [src/contact/contact.controller.ts](../src/contact/contact.controller.ts)

```typescript
@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  submit(@Body() dto: CreateContactDto, @Ip() ip: string, @Req() req: Request) {
    const clientIp = ip || req.ip || 'unknown';
    return this.contactService.submit(dto, clientIp);
  }
}
```

The controller's only job is **routing** — mapping an HTTP request to the right service method.
It should contain no business logic at all. Notice how thin it is: just one line of real code.

### Decorator breakdown

| Decorator | What it does |
|---|---|
| `@Controller('contact')` | All routes in this class are prefixed with `/contact` |
| `@Post()` | This method handles `POST /contact` |
| `@HttpCode(HttpStatus.CREATED)` | Responds with `201` (default for POST is 200 — 201 means "resource created") |
| `@Body()` | Extracts the JSON body from the request and validates it against the DTO |
| `@Ip()` | Extracts the caller's IP address from the request |
| `@Req()` | Gives access to the full Express request object (used as fallback if `@Ip()` returns nothing) |
| `@ApiTags('contact')` | Groups this controller under "contact" in the Swagger UI at `/api` |

### Why `ip || req.ip || 'unknown'`?

`@Ip()` works in most environments, but behind certain reverse proxies (like Nginx), it might return an empty string. `req.ip` is a fallback from Express. `'unknown'` is a last resort so the code never crashes trying to save `undefined` to the database.

---

## 7. The Service

**File:** [src/contact/contact.service.ts](../src/contact/contact.service.ts)

The service contains all the real business logic. Let's walk through it section by section.

### The constructor

```typescript
constructor(
  @InjectRepository(ContactSubmission)
  private readonly repo: Repository<ContactSubmission>,
  private readonly configService: ConfigService,
) {
  const apiKey = this.configService.get<string>('RESEND_API_KEY');
  this.resend = new Resend(apiKey);
  this.recipientEmail = this.configService.get<string>('RECIPIENT_EMAIL');
}
```

Two things are injected here:

**`Repository<ContactSubmission>`** — This is TypeORM's repository pattern.
A `Repository` is a class that knows how to talk to the database for one specific table.
It has methods like `.find()`, `.save()`, `.count()`, `.delete()`, etc.
You never write raw SQL — you call these methods instead.

`@InjectRepository(ContactSubmission)` is how you tell NestJS's DI system which table's repository you want. Without this decorator, NestJS wouldn't know which entity's repository to inject.

**`ConfigService`** — This is `@nestjs/config`'s service for reading environment variables.
`configService.get<string>('RESEND_API_KEY')` reads the `RESEND_API_KEY` variable from your `.env` file.
It's safer than using `process.env.RESEND_API_KEY` directly because ConfigService validates that the variable exists and handles different environments properly.

### The `submit()` method

```typescript
async submit(dto: CreateContactDto, ip: string): Promise<{ success: true }> {
```

`async` means this function returns a Promise — it does things that take time (database queries, HTTP calls to Resend) and JavaScript can do other work while waiting.

`Promise<{ success: true }>` means: when this async function finishes, it will resolve with the object `{ success: true }`. TypeScript knows this at compile time.

### Step 1: Rate limiting

```typescript
private async checkRateLimit(ip: string): Promise<void> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await this.repo.count({
    where: { ip_address: ip, submitted_at: MoreThan(oneHourAgo) },
  });
  if (recentCount >= 5) {
    throw new HttpException('Too many requests. Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
  }
}
```

`Date.now()` returns the current time in milliseconds. Subtracting `60 * 60 * 1000` (= 3,600,000 milliseconds = 1 hour) gives a timestamp for one hour ago.

`this.repo.count({ where: ... })` runs this SQL behind the scenes:
```sql
SELECT COUNT(*) FROM contact_submissions
WHERE ip_address = '123.45.67.89'
AND submitted_at > '2024-01-01 14:00:00'
```

`MoreThan()` is a TypeORM helper that translates to the SQL `>` operator.

If the count is 5 or more, we `throw` an exception. In NestJS, throwing an `HttpException` automatically stops execution and sends that HTTP status code and message to the client — you don't need to return anything or call `res.send()`.

`HttpStatus.TOO_MANY_REQUESTS` is just the number `429` — NestJS provides these as named constants so you don't have to memorize HTTP status codes.

### Step 2: Sanitization

There are two separate sanitization steps and it's important to understand why both exist.

**`stripHtml()` — used before saving to the database:**

```typescript
const name = this.stripHtml(dto.name);
const message = this.stripHtml(dto.message);

private stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}
```

`/<[^>]*>/g` is a regular expression that matches anything inside angle brackets (`<...>`).
The `g` flag means "replace all occurrences, not just the first."

So `<script>alert('xss')</script>John` becomes `John`.

This keeps the database clean — no HTML tags stored at rest.

**`escapeHtml()` — used inside `buildEmailHtml()` before inserting into the HTML template:**

```typescript
private escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
```

This converts characters that have special meaning in HTML into safe display equivalents.
It runs on all three user-supplied values — `name`, `email`, and `message` — right before they are embedded into the email template string.

**Why two separate methods instead of one?**

`stripHtml()` *removes* tags entirely — good for database storage where you want clean text.
`escapeHtml()` *encodes* characters so they display literally in HTML — good for email templates where you still want to show the original text, just safely.

They serve different purposes at different points in the flow:
```
User input → stripHtml() → stored in DB (clean text, no tags)
                         → escapeHtml() → embedded in email HTML (safe to render)
```

### Step 3: Save to database

```typescript
const submission = this.repo.create({
  name,
  email: dto.email,
  message,
  ip_address: ip,
  status: 'pending',
});
await this.repo.save(submission);
```

`this.repo.create()` — Creates an in-memory object that matches the `ContactSubmission` entity.
This does NOT touch the database yet. Think of it as building the row before inserting it.

`await this.repo.save(submission)` — NOW it hits the database. TypeORM generates and runs:
```sql
INSERT INTO contact_submissions (id, name, email, message, ip_address, status)
VALUES ('generated-uuid', 'John', 'john@example.com', 'Hello', '127.0.0.1', 'pending')
```

The `submitted_at` column is handled automatically by `@CreateDateColumn()` — you don't pass it.

We save *before* sending the email. This is intentional — if the email fails, we still have a record of the submission. This is a common pattern called **write-ahead logging**.

### Step 4: Send email

```typescript
const { error } = await this.resend.emails.send({
  from: 'onboarding@resend.dev',
  to: this.recipientEmail,
  replyTo: dto.email,
  subject: `Portfolio Contact: ${name}`,
  html: this.buildEmailHtml(...),
});
```

`replyTo: dto.email` — This is important. The email is *sent* from Resend's testing address, but if you hit "Reply" in your email client, it will pre-fill the *sender's* email address. This is the standard way to handle contact forms.

`{ error }` — destructuring. The Resend SDK returns an object like `{ data, error }`. We only care about `error` here.

### Step 5: Update status and handle errors

```typescript
if (error) {
  throw new Error(error.message);
}
submission.status = 'sent';
await this.repo.save(submission);
return { success: true };
```

```typescript
} catch (err) {
  this.logger.error('Failed to send contact email', err);
  submission.status = 'failed';
  await this.repo.save(submission);
  throw new InternalServerErrorException('Your message was received but...');
}
```

`this.logger.error(...)` — NestJS has a built-in logger. This writes to the server console, not to the HTTP response. The user never sees this message — it's for you to debug production issues.

`InternalServerErrorException` — a convenience class from NestJS that throws an HTTP 500 with a custom message. The raw error from Resend is logged but never sent to the client (that would expose internal details).

`await this.repo.save(submission)` — Calling `.save()` on an already-saved entity runs an `UPDATE` instead of an `INSERT`, because the entity already has an `id`. TypeORM detects this automatically.

### The `buildEmailHtml()` method

```typescript
const safeName    = this.escapeHtml(name);
const safeEmail   = this.escapeHtml(email);
const safeMessage = this.escapeHtml(message).replace(/\n/g, '<br>');
```

All three user-supplied values go through `escapeHtml()` before being interpolated into the template string. This converts characters that have special meaning in HTML into their safe display equivalents:

| Character | Becomes | Why |
|---|---|---|
| `&` | `&amp;` | `&` starts HTML entities |
| `"` | `&quot;` | `"` can break out of HTML attributes (e.g. `href="..."`) |
| `<` | `&lt;` | `<` starts HTML tags |
| `>` | `&gt;` | `>` ends HTML tags |

The `"` escape is especially important for `email`, which is placed inside an HTML attribute:
```html
<a href="mailto:${safeEmail}">${safeEmail}</a>
```
Without escaping `"`, a crafted email value could break out of the `href` attribute and inject arbitrary HTML attributes.

`message` gets one extra step after `escapeHtml()`:
```typescript
this.escapeHtml(message).replace(/\n/g, '<br>')
```
The order matters — escape first, then convert newlines. If you did it the other way around, the `<` and `>` in the `<br>` tags you just added would themselves get escaped into `&lt;br&gt;`, which would display as literal text instead of line breaks.

---

## 8. How app.module.ts Was Updated

**File:** [src/app.module.ts](../src/app.module.ts)

Three additions were made:

```typescript
// 1. New import
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { ContactSubmission } from './contact/contact.entity';

@Module({
  imports: [
    // 2. ConfigModule added first — isGlobal means every module can use ConfigService
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      entities: [
        // ... existing entities ...
        ContactSubmission,  // 3. New entity registered here
      ],
    }),

    // ... existing modules ...
    ContactModule,  // 4. New module registered here
  ],
})
```

**Why does `ContactSubmission` need to be in two places?**

- In `ContactModule`: `TypeOrmModule.forFeature([ContactSubmission])` — makes the repository injectable *within* the contact module
- In `AppModule`: in the `entities` array — tells TypeORM to create/sync the actual database table

This feels redundant, but it's by design. `forRoot` is global database config (what tables exist). `forFeature` is module-scoped (who can use which repositories).

**`ConfigModule.forRoot({ isGlobal: true })`** — Loads your `.env` file and makes `ConfigService` available everywhere without needing to import `ConfigModule` in every feature module.

---

## 9. How main.ts Was Updated

**File:** [src/main.ts](../src/main.ts)

Two changes:

### Global ValidationPipe

```typescript
app.useGlobalPipes(
  new ValidationPipe({ whitelist: true, transform: true }),
);
```

This registers the validation pipe for *every* endpoint in the app, not just contact.
Without this, the `class-validator` decorators on the DTO do nothing.

- `whitelist: true` — strips unknown fields from the request body
- `transform: true` — runs `@Transform` decorators and converts plain objects to class instances

### CORS update

```typescript
const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());
app.enableCors({
  origin: origins,
  methods: ['GET', 'POST'],  // ← POST added for the contact form
});
```

CORS (Cross-Origin Resource Sharing) is a browser security feature. Without it, your React frontend (running on `localhost:5173`) couldn't make requests to your backend (running on `localhost:3000`) — browsers block this by default.

Previously only `'GET'` was allowed. The contact form needs `POST`, so it was added.

The origins come from `CORS_ORIGINS` in your `.env` file, split by comma. This lets you add your production frontend URL without changing code.

---

## 10. Security Features Explained

### Rate limiting — why it matters

Without rate limiting, a bot could submit thousands of contact requests per second:
- Flood your inbox with spam
- Exhaust Resend's free tier instantly
- Slow down the database

The limit of **5 submissions per IP per hour** is stored in the `contact_submissions` table itself — no extra package or table needed. The check runs before any email is sent.

### Input validation — why it matters

`@MaxLength(2000)` on the message prevents someone from sending a 10MB string that could slow down the database insert or the email send.

`@IsEmail()` uses the industry-standard `validator.js` library under the hood — it checks for a valid email format so the Reply-To header in your email actually works.

### HTML sanitization — two layers, two different jobs

**Layer 1 — `stripHtml()`** strips `<tags>` from `name` and `message` before they are saved to the database. The goal is clean stored data with no HTML markup at rest.

**Layer 2 — `escapeHtml()`** runs inside `buildEmailHtml()` on all three user values (`name`, `email`, `message`) before they are embedded in the email template. It encodes `&`, `"`, `<`, `>` into their HTML entity equivalents so the characters render as visible text rather than being interpreted as HTML structure.

The `"` character matters specifically for `email` because it appears inside an HTML attribute (`href="mailto:..."`). Without escaping it, a crafted email address could inject extra attributes into that tag.

### Status tracking — why it matters

Every submission row has a `status` field. This means:
- If your email stops working (expired API key, Resend outage), the messages aren't lost
- You can query the DB for `status = 'failed'` and resend them later
- You have an audit trail for compliance or debugging

---

## 11. Environment Variables

**File:** [.env.example](../.env.example)

```
RESEND_API_KEY=re_...
RECIPIENT_EMAIL=you@gmail.com
CORS_ORIGINS=http://localhost:5173,https://your-portfolio.com
PORT=3000
```

Copy this to `.env` (which is gitignored) and fill in real values.

`ConfigService.get('KEY')` reads from `.env` via the `dotenv` library that `@nestjs/config` wraps. The variables are loaded once at startup — changing `.env` requires a server restart.

**Never commit `.env` to git.** The `.env.example` file documents what variables exist without storing real secrets.
