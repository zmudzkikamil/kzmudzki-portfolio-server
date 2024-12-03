import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  // Simplified list of projects
  async findAllSimplified(): Promise<Partial<Project>[]> {
    return this.projectRepository.find({
      select: ['id', 'category', 'title', 'image'], // Only fetch minimal fields
    });
  }

  // Detailed project view by ID
  async findDetailedById(id: string): Promise<Project> {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['views', 'improvements'], // Include related entities
    });
  }
}
