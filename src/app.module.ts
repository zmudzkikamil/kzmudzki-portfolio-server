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
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
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
      synchronize: false,
      migrations: ['dist/database/migrations/*.js'],
      migrationsRun: true,
      logging: process.env.NODE_ENV !== 'production',
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
