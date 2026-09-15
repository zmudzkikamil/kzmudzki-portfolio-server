# Database Seeding

This directory contains seed files for populating the database with initial/demo data.

## 📋 Overview

Seeds are used to populate the database with initial data for development, testing, or demo purposes. Unlike migrations (which handle schema changes), seeds handle data insertion.

## 🚀 Usage

### Migrations come first

Seeds insert data, they never touch the schema, so the tables have to exist and
be current before any of the commands below will work:

```bash
npm run migration:show   # what is pending
npm run migration:run    # apply it
```

The API runs pending migrations itself when it boots, so a database the API has
started against is already up to date. A database that has only ever been
seeded is not — and seeding into a schema that predates a column an entity
declares used to fail with a bare `column Project.url does not exist`. The seed
scripts now stop with an explanation instead.

### Run All Seeds

```bash
npm run seed
```

This will:

- Check if data already exists (idempotent)
- Skip seeding if data is already present
- Seed all entities in the correct order

### Clear All Data

```bash
npm run seed:clear
```

⚠️ **WARNING**: This deletes ALL data from the database!

### Refresh Seeds (Clear + Seed)

```bash
npm run seed:refresh
```

This is useful during development when you want to reset the database to its initial state.

## 📁 Seed Files

Each entity has its own seed file:

- `knowledge.seed.ts` - Skills and knowledge categories
- `about-me.seed.ts` - Personal timeline/milestones
- `experience.seed.ts` - Work experience and positions
- `certs.seed.ts` - Certifications
- `projects.seed.ts` - Projects with views and improvements

## 🔧 How It Works

### Idempotency

All seed files check if data already exists before inserting:

```typescript
const count = await repository.count();
if (count > 0) {
  console.log('✓ Data already exists, skipping...');
  return;
}
```

This means you can safely run `npm run seed` multiple times without duplicating data.

### Order of Execution

Seeds run in this order (from `run-seeds.ts`):

1. Knowledge
2. About Me
3. Experience (with Positions)
4. Certs
5. Projects (with Views and Improvements)

This order respects entity relationships and foreign key constraints.

## ✍️ Adding New Seeds

To add a new seed file:

1. Create `your-entity.seed.ts`:

```typescript
import { DataSource } from 'typeorm';
import { YourEntity } from '../../your-module/your-entity.entity';

export async function seedYourEntity(dataSource: DataSource): Promise<void> {
  const repository = dataSource.getRepository(YourEntity);

  // Check if data exists
  const count = await repository.count();
  if (count > 0) {
    console.log('✓ YourEntity data already exists, skipping...');
    return;
  }

  console.log('Seeding your entity data...');

  await repository.save([
    // Your data here
  ]);

  console.log('✓ YourEntity data seeded successfully');
}
```

2. Add to `run-seeds.ts`:

```typescript
import { seedYourEntity } from './your-entity.seed';

// In the runSeeds function:
await seedYourEntity(AppDataSource);
```

3. Add to `clear-database.ts` if needed

4. Export from `index.ts`

## 🆚 Seeds vs Migrations

### Use Seeds For:

- Initial/demo data
- Development data
- Testing data
- Data that can be regenerated

### Use Migrations For:

- Schema changes (creating tables, columns)
- Altering table structure
- Adding indexes
- Production schema updates

## 🔍 Debugging

If seeds fail, check:

1. **Database connection**: Is the database accessible?
2. **Entity relationships**: Are foreign keys valid?
3. **Data constraints**: Are required fields provided?
4. **Order of execution**: Does entity A depend on entity B?

Enable logging in `app.module.ts`:

```typescript
logging: true,
```

## 📝 Best Practices

1. ✅ **Keep seeds idempotent** - Always check if data exists
2. ✅ **Don't hardcode IDs** - Let the database generate them (except for @PrimaryColumn)
3. ✅ **Respect relationships** - Seed parent entities before children
4. ✅ **Use transactions** - Seeds should be atomic (all or nothing)
5. ✅ **Keep seeds simple** - Complex business logic belongs in services
6. ✅ **Version control** - Commit seed files to git
7. ❌ **Don't use seeds in production** - Use proper data migration strategies

## 🎯 Production Considerations

For production deployments:

1. **Don't use `synchronize: true`** in `app.module.ts`
2. Use proper migrations for schema changes
3. Consider data migration scripts for production data
4. Use environment-specific seed data
5. Implement proper backup/restore strategies
