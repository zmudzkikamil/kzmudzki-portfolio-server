# Portfolio App - API (Server Side)

**Kamil Żmudzki** · [zkamil.eu](https://zkamil.eu) · [Digital CV](https://zkamil.eu/cv)

> REST API powering a personal portfolio and digital CV. Built with NestJS, TypeORM, and PostgreSQL hosted on Supabase.

---

## Why NestJS?

I chose NestJS for this project intentionally, for learning purposes rather than optimality:

- **Structured architecture** - modules, controllers, services, and dependency injection enforce a clear, scalable project layout I wanted to understand hands-on.
- **TypeScript-first** - strict typing throughout, aligned with how I approach frontend work.
- **Decorator-driven design** - integrates naturally with TypeORM entities and Swagger auto-documentation.
- **Real-world relevance** - NestJS is widely used in commercial applications; working with it here gave me practical experience beyond tutorials.

---

## Tech Stack

| Layer     | Technology                                             |
| --------- | ------------------------------------------------------ |
| Framework | NestJS 10, Express                                     |
| Language  | TypeScript 5                                           |
| ORM       | TypeORM 0.3                                            |
| Database  | PostgreSQL (hosted on Supabase)                        |
| API Docs  | @nestjs/swagger 8 (auto-generated via Nest CLI plugin) |

---

## API Endpoints

All endpoints are read-only GET requests except the contact form. No authentication layer.

| Method | Path              | Description                                |
| ------ | ----------------- | ------------------------------------------ |
| `GET`  | `/about-me`       | Personal timeline entries                  |
| `GET`  | `/about-me/:id`   | Single timeline entry                      |
| `GET`  | `/experience`     | Work experience with nested positions      |
| `GET`  | `/experience/:id` | Single experience entry                    |
| `GET`  | `/knowledge`      | Skills grouped by category                 |
| `GET`  | `/knowledge/:id`  | Single skill category                      |
| `GET`  | `/certs`          | Certifications                             |
| `GET`  | `/projects`       | All projects (summary view)                |
| `GET`  | `/projects/:id`   | Full project detail (views + improvements) |
| `POST` | `/contact`        | Submit contact form message                |

Interactive documentation (Swagger UI) is available at `http://localhost:3000/api` when running locally.

---

## Database Schema

PostgreSQL managed via TypeORM migrations (`synchronize: false`). Schema is never modified manually.

### Entities & Relationships

```
about_me
  id, year, title, description, icon

experience  ──┐
  id, company, period

position    ──┘ (ManyToOne → experience)
  id, title, period, description, skills[]

knowledge
  id, category, level, skills[]

cert
  id, name, description, date_issued, expiration_date, icon

project     ──┐
  id (string), category, title, image, skills[], details{}, technologies{}

view        ──┘ (ManyToOne → project, CASCADE DELETE)
  id (UUID), title, image

improvement ──┘ (ManyToOne → project, CASCADE DELETE)
  id (UUID), improvement, description, description_details{}

contact_submission
  id (UUID), name, email, message, ip_address, submitted_at, status
```

### Seeds

Seed files are the authoritative source for all data.

```bash
npm run seed           # populate DB
npm run seed:clear     # clear all data
npm run seed:refresh   # clear + re-seed
```

Seed files live in `src/database/seeds/` - one file per module (`about-me.seed.ts`, `experience.seed.ts`, etc.).

---

## Project Structure

```
src/
├── about-me/          # Personal timeline
├── certs/             # Certifications
├── contact/           # Contact form (POST + entity)
├── experience/        # Work experience + Position entities
├── knowledge/         # Skills by category
├── projects/
│   └── entities/      # Project, View, Improvement
├── database/
│   ├── migrations/    # TypeORM migration files
│   └── seeds/         # Seed scripts per module
├── public/            # Static assets (per-project images)
├── app.module.ts      # Root module + TypeORM global config
├── data-source.ts     # CLI-only DataSource (migrations, seeds)
└── main.ts            # Bootstrap: CORS, Swagger, static files
```

Each feature module follows the same pattern: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.entity.ts`, `*.spec.ts`.

---

## UI/UX Figma Concepts

The frontend design was self-designed in Figma before implementation.

<p align="center">
  <img src="https://github.com/user-attachments/assets/4c9bc46c-c787-431f-869c-2404d7d1cb00" width="45%" />
  <img src="https://github.com/user-attachments/assets/5c05c4a9-0efa-4f52-9606-c07d073e3860" width="45%" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/97b159cc-725f-4d29-a4f3-415c97b1386c" width="45%" />
  <img src="https://github.com/user-attachments/assets/4bf4bf08-d1d8-47aa-b3aa-e8f81932898f" width="45%" />
</p>

---

## Related

- **Frontend repo:** [kzmudzki-portfolio-client](https://github.com/zmudzkikamil/kzmudzki-portfolio-client) - React 18, TanStack Query, Tailwind CSS
- **Live site:** [zkamil.eu](https://zkamil.eu)
