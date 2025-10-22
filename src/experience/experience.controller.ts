import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { Experience } from './experience.entity';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  // Get all Experience items
  @Get()
  async findAll(): Promise<Experience[]> {
    return await this.experienceService.findAll();
  }

  // Get a single Experience item by id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Experience> {
    const experienceItem = await this.experienceService.findOne(+id); // Convert string param to number
    if (!experienceItem) {
      throw new NotFoundException(`Experience item with ID ${id} not found`);
    }
    return experienceItem;
  }
}
