import { AppDataSource } from '../../data-source';
import { Knowledge } from '../../knowledge/knowledge.entity';
import { AboutMe } from '../../about-me/about-me.entity';
import { Experience } from '../../experience/experience.entity';
import { Position } from '../../experience/position.entity';
import { Cert } from '../../certs/certs.entity';
import { Project } from '../../projects/entities/project.entity';
import { View } from '../../projects/entities/view.entity';
import { Improvement } from '../../projects/entities/improvement.entity';

async function clearDatabase() {
  console.log('🗑️  Starting database cleanup...\n');

  try {
    // Initialize the data source
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✓ Data Source initialized\n');
    }

    // Clear data in reverse order of dependencies
    console.log('Clearing Views...');
    await AppDataSource.getRepository(View).delete({});

    console.log('Clearing Improvements...');
    await AppDataSource.getRepository(Improvement).delete({});

    console.log('Clearing Projects...');
    await AppDataSource.getRepository(Project).delete({});

    console.log('Clearing Positions...');
    await AppDataSource.getRepository(Position).delete({});

    console.log('Clearing Experience...');
    await AppDataSource.getRepository(Experience).delete({});

    console.log('Clearing Certs...');
    await AppDataSource.getRepository(Cert).delete({});

    console.log('Clearing About Me...');
    await AppDataSource.getRepository(AboutMe).delete({});

    console.log('Clearing Knowledge...');
    await AppDataSource.getRepository(Knowledge).delete({});

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

// Run the cleanup
clearDatabase();
