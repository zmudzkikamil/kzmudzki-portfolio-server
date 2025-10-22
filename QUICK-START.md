# ⚡ Quick Start After Seed Migration

## 🎯 What You Need to Do

### 1. Delete Your Old Database

```bash
# Navigate to server directory
cd kzmudzki-portfolio-server

# Delete the old database file
rm database.sqlite
# or on Windows:
# del database.sqlite
```

### 2. Run the New Seeds

```bash
npm run seed
```

You should see:

```
🌱 Starting database seeding...

✓ Data Source initialized

Seeding knowledge data...
✓ Knowledge data seeded successfully
Seeding about me data...
✓ About Me data seeded successfully
Seeding experience data...
✓ Experience data seeded successfully
Seeding certs data...
✓ Certs data seeded successfully
Seeding projects data...
✓ Projects data seeded successfully

✅ All seeds completed successfully!
```

### 3. Start Your Server

```bash
npm run start:dev
```

### 4. Update Frontend Types (Important!)

IDs changed from `string` to `number` for most entities. Regenerate types:

```bash
# Navigate to client directory
cd ../kzmudzki-portfolio-client

# Regenerate types (make sure server is running!)
npm run generate-types
```

## ✅ Done!

Your application is now using a proper seeding system.

## 📚 Learn More

- **SETUP.md** - Complete setup guide
- **MIGRATION-TO-SEEDS.md** - What changed and why
- **src/database/seeds/README.md** - How to work with seeds

## 🛠️ Useful Commands

```bash
# Seed database (safe to run multiple times)
npm run seed

# Clear all data and re-seed
npm run seed:refresh

# Just clear data
npm run seed:clear
```

## ⚠️ Note

If you see errors in your frontend about ID types, it's because:

- `AboutMe.id` is now `number` (was `string`)
- `Experience.id` is now `number` (was `string`)
- `Knowledge.id` is now `number` (was `string`)
- `Position.id` is now `number` (was `string`)
- `Cert.id` is now `number` (was `number` - no change)
- `Project.id` is still `string` (uses custom ID)

Run `npm run generate-types` in your client to fix this!
