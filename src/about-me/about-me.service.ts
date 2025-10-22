import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AboutMe } from './about-me.entity';

@Injectable()
export class AboutMeService {
  constructor(
    @InjectRepository(AboutMe)
    private readonly aboutMeRepository: Repository<AboutMe>,
  ) {}

  findAll() {
    return this.aboutMeRepository.find();
  }

  findOne(id: number) {
    return this.aboutMeRepository.findOne({ where: { id } });
  }
}
