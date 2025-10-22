import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Knowledge } from './knowledge.entity';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(Knowledge)
    private readonly knowledgeRepository: Repository<Knowledge>,
  ) {}

  // Fetch all knowledge entries
  async findAll(): Promise<Knowledge[]> {
    return await this.knowledgeRepository.find();
  }

  // Fetch a single knowledge entry by ID
  async findOne(id: number): Promise<Knowledge> {
    return await this.knowledgeRepository.findOneBy({ id });
  }
}
