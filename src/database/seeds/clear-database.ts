import { AppDataSource } from '../../data-source';
import { abortIfMigrationsPending } from '../pending-migrations';

async function clearDatabase() {
  console.log('🗑️  Starting database cleanup...\n');

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✓ Data Source initialized\n');
    }

    // The tables truncated below are the migrations' output, so the same
    // check applies: on a database that has never been migrated they do not
    // exist yet, and TRUNCATE would fail just as opaquely.
    await abortIfMigrationsPending(AppDataSource);

    await AppDataSource.query(`
      TRUNCATE TABLE
        "view", "improvement", "project",
        "position", "experience",
        "cert", "about_me", "knowledge"
      CASCADE
    `);

    console.log('\n✅ Database cleared successfully!');
  } catch (error) {
    console.error('\n❌ Error clearing database:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('✓ Data Source closed');
    }
  }
}

clearDatabase();
