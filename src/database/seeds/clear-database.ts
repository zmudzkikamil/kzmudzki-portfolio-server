import { AppDataSource } from '../../data-source';

async function clearDatabase() {
  console.log('🗑️  Starting database cleanup...\n');

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✓ Data Source initialized\n');
    }

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
