import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  findAll() {
    return this.projectRepository.find({
      relations: ['views', 'improvements'],
    });
  }

  findOne(id: string) {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['views', 'improvements'],
    });
  }
}
