import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { Knowledge } from './knowledge.entity';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  // Endpoint to fetch all knowledge entries
  @Get()
  async getAllKnowledge(): Promise<Knowledge[]> {
    return await this.knowledgeService.findAll();
  }

  // Endpoint to fetch a specific knowledge entry by ID
  @Get(':id')
  async getKnowledgeById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Knowledge> {
    return await this.knowledgeService.findOne(id);
  }
}
