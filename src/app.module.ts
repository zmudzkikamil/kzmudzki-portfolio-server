import { Module } from '@nestjs/common';
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
import { View } from './projects/entities/view.entity';
import { Improvement } from './projects/entities/improvement.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [
        AboutMe,
        Position,
        Experience,
        Knowledge,
        Project,
        View,
        Improvement,
      ], // Your entities
      synchronize: true, // Synchronizes schema; disable in production!
    }),
    AboutMeModule,
    ExperienceModule,
    KnowledgeModule,
    ProjectsModule,
  ],
})
export class AppModule {}
