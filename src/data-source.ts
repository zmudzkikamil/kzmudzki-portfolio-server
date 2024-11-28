import { DataSource } from 'typeorm';
import { Experience } from './experience/experience.entity';
import { Knowledge } from './knowledge/knowledge.entity';
import { AboutMe } from './about-me/about-me.entity';
import { Position } from './experience/position.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite', // or 'mysql', 'postgres', etc.
  database: 'database.sqlite',
  entities: [AboutMe, Position, Experience, Knowledge], // Your entities
  migrations: ['./src/database/migrations/*.ts'], // Migration files location
  synchronize: false, // Don't automatically sync schema in production
  logging: true,
});
