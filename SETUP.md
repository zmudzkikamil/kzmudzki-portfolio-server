# Portfolio Server Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

The project uses SQLite with TypeORM. The database file will be created automatically.

### 3. Seed the Database

Run the seed command to populate the database with initial data:

```bash
npm run seed
```

You should see output like:

```
🌱 Starting database seeding...

✓ Data Source initialized

Seeding knowledge data...
✓ Knowledge data seeded successfully
Seeding about me data...
✓ About Me data seeded successfully
...

✅ All seeds completed successfully!
```

### 4. Start the Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### 5. View API Documentation

Open `http://localhost:3000/api` to see the Swagger API documentation.

## 🛠️ Available Scripts

### Development

- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start with debugging enabled

### Production

- `npm run build` - Build the application
- `npm run start:prod` - Start production server

### Database Seeds

- `npm run seed` - Seed database with initial data
- `npm run seed:clear` - Clear all data from database ⚠️
- `npm run seed:refresh` - Clear and re-seed database

### Testing

- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Generate test coverage report
- `npm run test:e2e` - Run end-to-end tests

### Code Quality

- `npm run lint` - Lint and fix code issues
- `npm run format` - Format code with Prettier

### Migrations (for future use)

- `npm run migration:generate` - Generate a new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration

## 📊 Database Structure

The application has the following entities:

- **AboutMe** - Personal milestones and achievements
- **Knowledge** - Skills and knowledge categories with proficiency levels
- **Experience** - Work experience with multiple positions
- **Position** - Individual roles within an experience
- **Cert** - Certifications and diplomas
- **Project** - Portfolio projects
- **View** - Screenshots/views of projects
- **Improvement** - Suggested improvements for projects

## 🔧 Configuration

### Environment Variables

Currently, the application uses default configurations. For production, you should create a `.env` file:

```env
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_TYPE=better-sqlite3
DATABASE_NAME=database.sqlite

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

### TypeORM Settings

The database configuration is in `src/app.module.ts`:

```typescript
TypeOrmModule.forRoot({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  entities: [...],
  synchronize: true, // ⚠️ Set to false in production!
  logging: process.env.NODE_ENV === 'development',
})
```

**Important**: `synchronize: true` is for development only. In production:

1. Set `synchronize: false`
2. Use migrations for schema changes
3. Consider migrating to PostgreSQL or MySQL

## 🌱 Working with Seeds

### When to Re-seed

You should re-seed the database when:

- Starting fresh development
- Testing data changes
- Resetting to a known state
- After significant data model changes

### Modifying Seed Data

Seed files are located in `src/database/seeds/`. To modify data:

1. Edit the appropriate seed file (e.g., `experience.seed.ts`)
2. Run `npm run seed:refresh` to apply changes

### Adding New Seed Data

See `src/database/seeds/README.md` for detailed instructions on creating new seed files.

## 🐛 Troubleshooting

### Database Locked Error

If you get a "database is locked" error:

```bash
# Stop all running instances
# Delete the database file
rm database.sqlite
# Re-seed
npm run seed
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
PORT=3001 npm run start:dev
```

### TypeScript Errors

```bash
# Clean build
rm -rf dist
npm run build
```

## 📝 API Endpoints

### About Me

- `GET /about-me` - Get all about me entries
- `GET /about-me/:id` - Get single entry by ID

### Experience

- `GET /experience` - Get all work experiences with positions
- `GET /experience/:id` - Get single experience by ID

### Knowledge

- `GET /knowledge` - Get all knowledge categories

### Certifications

- `GET /certs` - Get all certifications

### Projects

- `GET /projects` - Get all projects (simplified)
- `GET /projects/:id` - Get detailed project with views and improvements

## 🔐 Security Notes

This is a portfolio/demo application with read-only endpoints. For production use, consider:

1. Adding authentication/authorization
2. Rate limiting
3. Input validation with DTOs
4. Helmet for security headers
5. HTTPS/SSL certificates
6. Environment-based configuration
7. Database connection pooling
8. Proper error handling

## 📚 Next Steps

1. ✅ Database seeded and running
2. 📝 Review API documentation at `/api`
3. 🎨 Connect frontend application
4. 🧪 Write tests for your endpoints
5. 🚀 Deploy to production

## 🤝 Development Workflow

```bash
# 1. Pull latest changes
git pull

# 2. Install dependencies (if package.json changed)
npm install

# 3. Refresh database if needed
npm run seed:refresh

# 4. Start development server
npm run start:dev

# 5. Make your changes

# 6. Format and lint
npm run format
npm run lint

# 7. Run tests
npm run test

# 8. Commit changes
git add .
git commit -m "Your message"
git push
```

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Swagger/OpenAPI](https://swagger.io/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
