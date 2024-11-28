import { DataSource } from 'typeorm';
import { SeedKnowledge } from './seeders/SeedKnowledge';

const dataSource = new DataSource({
  type: 'sqlite',
  database: '../../database.sqlite',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // This will include all entities
  synchronize: false, // Do not automatically sync tables (you've already used synchronize in app.module)
});

async function runSeeders() {
  await dataSource.initialize();
  console.log('Database connected.');

  const queryRunner = dataSource.createQueryRunner();

  // Run the seeder
  await new SeedKnowledge().up(queryRunner);
  console.log('Seeders executed successfully.');

  await queryRunner.release();
  await dataSource.destroy();
}

runSeeders().catch((err) => {
  console.error('Error running seeders:', err);
  process.exit(1);
});
