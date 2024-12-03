import { Controller, Get, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAllSimplified();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findDetailedById(id);
  }
}
