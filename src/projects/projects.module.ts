import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Improvement } from './entities/improvement.entity';
import { View } from './entities/view.entity';
import { Project } from './entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, View, Improvement])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
