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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [AboutMe, Position, Experience, Knowledge], // Your entities
      synchronize: true, // Synchronizes schema; disable in production!
    }),
    AboutMeModule,
    ExperienceModule,
    KnowledgeModule,
    ProjectsModule,
  ],
})
export class AppModule {}
