import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutMeModule } from './about-me/about-me.module';
import { ExperienceModule } from './experience/experience.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { AboutMe } from './about-me/about-me.entity';
import { Position } from './experience/position.entity';
import { Experience } from './experience/experience.entity';
import { Knowledge } from './knowledge/knowledge.entity';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/entities/project.entity';
import { Cert } from './certs/certs.entity';
import { View } from './projects/entities/view.entity';
import { Improvement } from './projects/entities/improvement.entity';
import { CertsModule } from './certs/certs.module';
import { ContactModule } from './contact/contact.module';
import { ContactSubmission } from './contact/contact.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
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
      // synchronize: true creates/updates tables automatically based on entities
      // This is fine for development but MUST BE FALSE in production
      // For production: use migrations instead (migration:generate, migration:run)
      synchronize: true,
      // Enable logging to see SQL queries during development
      logging: process.env.NODE_ENV === 'development',
    }),
    AboutMeModule,
    ExperienceModule,
    KnowledgeModule,
    ProjectsModule,
    CertsModule,
    ContactModule,
  ],
})
export class AppModule {}
