import { Controller, Get, Param } from '@nestjs/common';
import { AboutMeService } from './about-me.service';

@Controller('about-me')
export class AboutMeController {
  constructor(private readonly aboutMeService: AboutMeService) {}

  @Get()
  findAll() {
    return this.aboutMeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aboutMeService.findOne(+id); // Convert string param to number
  }
}
