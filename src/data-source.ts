import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Experience } from './experience/experience.entity';
import { Knowledge } from './knowledge/knowledge.entity';
import { AboutMe } from './about-me/about-me.entity';
import { Position } from './experience/position.entity';
import { Project } from './projects/entities/project.entity';
import { View } from './projects/entities/view.entity';
import { Improvement } from './projects/entities/improvement.entity';
import { Cert } from './certs/certs.entity';
import { ContactSubmission } from './contact/contact.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [
    AboutMe,
    Position,
    Experience,
    Knowledge,
    Project,
    View,
    Improvement,
    Cert,
    ContactSubmission,
  ],
  migrations: ['src/database/migrations/*.ts'],
  logging: true,
});
