import { Controller, Get } from '@nestjs/common';
import { CertsService } from './certs.service';

@Controller('certs')
export class CertsController {
  constructor(private readonly certsService: CertsService) {}
  @Get()
  findAll() {
    return this.certsService.findAll();
  }
}
