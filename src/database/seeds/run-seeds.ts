import { AppDataSource } from '../../data-source';
import { abortIfMigrationsPending } from '../pending-migrations';
import { seedKnowledge } from './knowledge.seed';
import { seedAboutMe } from './about-me.seed';
import { seedExperience } from './experience.seed';
import { seedCerts } from './certs.seed';
import { seedProjects } from './projects.seed';

async function runSeeds() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Initialize the data source
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✓ Data Source initialized\n');
    }

    await abortIfMigrationsPending(AppDataSource);

    // Run seeds in order (some may have dependencies)
    await seedKnowledge(AppDataSource);
    await seedAboutMe(AppDataSource);
    await seedExperience(AppDataSource);
    await seedCerts(AppDataSource);
    await seedProjects(AppDataSource);

    console.log('\n✅ All seeds completed successfully!');
  } catch (error) {
    console.error('\n❌ Error running seeds:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('✓ Data Source closed');
    }
  }
}

// Run the seeds
runSeeds();
