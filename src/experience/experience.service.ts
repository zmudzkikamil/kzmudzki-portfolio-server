import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './experience.entity';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  findAll() {
    return this.experienceRepository.find({ relations: ['positions'] });
  }

  findOne(id: string) {
    return this.experienceRepository.findOne({
      where: { id },
      relations: ['positions'],
    });
  }
}
