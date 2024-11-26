import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './experience.entity';
import { Position } from './position.entity';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';

@Module({
  imports: [TypeOrmModule.forFeature([Experience, Position])],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule {}
