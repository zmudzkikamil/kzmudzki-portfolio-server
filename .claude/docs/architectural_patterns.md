# Architectural Patterns

Patterns confirmed across multiple files in this codebase.

---

## 1. Feature Module Structure

Every domain has its own NestJS module folder containing exactly these files:

```
src/{feature}/
├── {feature}.module.ts      # @Module wiring
├── {feature}.controller.ts  # Route handlers
├── {feature}.service.ts     # Business/data logic
├── {feature}.entity.ts      # TypeORM entity (or entities/ subfolder)
├── {feature}.controller.spec.ts
└── {feature}.service.spec.ts
```

Modules register their own entities with `TypeOrmModule.forFeature([...])` — they do **not** share repositories across modules.

References: [src/projects/projects.module.ts:9-13](../../src/projects/projects.module.ts#L9-L13), [src/knowledge/knowledge.module.ts](../../src/knowledge/knowledge.module.ts), [src/certs/certs.module.ts](../../src/certs/certs.module.ts)

---

## 2. Repository Injection Pattern

All services receive TypeORM repositories via constructor injection using `@InjectRepository`:

```
// Pattern (do not copy — see real files for exact imports)
constructor(@InjectRepository(Entity) private repo: Repository<Entity>) {}
```

Never inject repositories from other modules — each service owns its own repositories.

References: [src/projects/projects.service.ts:8-10](../../src/projects/projects.service.ts#L8-L10), [src/knowledge/knowledge.service.ts:9-10](../../src/knowledge/knowledge.service.ts#L9-L10), [src/about-me/about-me.service.ts](../../src/about-me/about-me.service.ts)

---

## 3. Entities as API Response Types (No DTO Layer)

There are **no separate DTO classes**. Entity classes are returned directly from service methods and serialized to JSON. `@ApiProperty()` decorators on entity fields serve dual purpose: TypeORM column metadata + Swagger schema documentation.

No `class-validator`, `class-transformer`, or `@nestjs/mapped-types` are used.

References: [src/projects/entities/project.entity.ts](../../src/projects/entities/project.entity.ts), [src/experience/experience.entity.ts](../../src/experience/experience.entity.ts), [src/certs/certs.entity.ts](../../src/certs/certs.entity.ts)

---

## 4. Array Storage in SQLite

Two column types are used for array data:

- `simple-array` — flat `string[]`, stored as comma-separated string. Use for non-nullable string lists.
- `simple-json` — `string[]` or object arrays, stored as JSON string. Use when nullable or contains non-string values.

References:
- `simple-array`: [src/projects/entities/project.entity.ts:37](../../src/projects/entities/project.entity.ts#L37), [src/experience/position.entity.ts:18](../../src/experience/position.entity.ts#L18)
- `simple-json`: [src/projects/entities/project.entity.ts:45,53](../../src/projects/entities/project.entity.ts#L45), [src/projects/entities/improvement.entity.ts:15](../../src/projects/entities/improvement.entity.ts#L15)

---

## 5. Cascade Delete — Parent/Child Relation Convention

Child entities (View, Improvement) declare cascade delete on the `@ManyToOne` side. Parent entities declare `@OneToMany` with `cascade: true`.

- **Child**: `@ManyToOne(() => Parent, p => p.children, { onDelete: 'CASCADE' })`
- **Parent**: `@OneToMany(() => Child, c => c.parent, { cascade: true })`

References: [src/projects/entities/improvement.entity.ts:18-21](../../src/projects/entities/improvement.entity.ts#L18-L21), [src/projects/entities/project.entity.ts:57-66](../../src/projects/entities/project.entity.ts#L57-L66)

---

## 6. Primary Key Strategy

Three different ID strategies are in use — match the pattern of the entity you're extending:

| Entity | Strategy | Type |
|---|---|---|
| AboutMe, Experience, Knowledge, Cert, Position | `@PrimaryGeneratedColumn()` | `number` (auto-increment) |
| Project | `@PrimaryColumn()` | `string` (manually set in seed) |
| Improvement, View | `@PrimaryGeneratedColumn('uuid')` | `string` (UUID) |

References: [src/projects/entities/project.entity.ts:9-10](../../src/projects/entities/project.entity.ts#L9-L10), [src/projects/entities/improvement.entity.ts:6](../../src/projects/entities/improvement.entity.ts#L6), [src/about-me/about-me.entity.ts](../../src/about-me/about-me.entity.ts)

---

## 7. Controller Delegation Pattern

Controllers contain **zero business logic**. Every handler is a one-liner that calls the corresponding service method and returns the result. No try/catch — NestJS exception filters handle errors.

```
// Structure (consult actual files):
@Controller('route')         // sets URL prefix
@Get()                       // GET /route
findAll() { return this.service.findAll(); }

@Get(':id')                  // GET /route/:id
findOne(@Param('id') id) { return this.service.findOne(id); }
```

References: [src/projects/projects.controller.ts:4-16](../../src/projects/projects.controller.ts#L4-L16), [src/knowledge/knowledge.controller.ts](../../src/knowledge/knowledge.controller.ts), [src/certs/certs.controller.ts](../../src/certs/certs.controller.ts)

---

## 8. Seed Pattern

Each seed file exports an async function that:
1. Connects to the DataSource from [src/data-source.ts](../../src/data-source.ts)
2. Calls `.count()` to skip if data already exists
3. Calls `.save()` with the full dataset

CLI entry: [src/database/seeds/run-seeds.ts](../../src/database/seeds/run-seeds.ts)
All seeds exported from: [src/database/seeds/index.ts](../../src/database/seeds/index.ts)

References: [src/database/seeds/projects.seed.ts:12,21](../../src/database/seeds/projects.seed.ts#L12), [src/database/seeds/experience.seed.ts](../../src/database/seeds/experience.seed.ts)

---

## 9. Schema Synchronization (No Active Migrations)

`synchronize: true` in [src/app.module.ts:35](../../src/app.module.ts#L35) means TypeORM auto-creates/updates the SQLite schema from entity definitions on every startup. Migrations are **not used at runtime**.

`src/database/migrations/` and `src/data-source.ts` exist solely to support the `npm run migration:*` CLI commands if ever needed. Do not reference them from feature code.

When adding a new column or entity: add it to the entity class and register in [src/app.module.ts](../../src/app.module.ts) (entities array) + [src/data-source.ts](../../src/data-source.ts) (entities array). Run `npm run seed:refresh` to repopulate.