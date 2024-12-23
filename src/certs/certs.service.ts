import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cert } from './certs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CertsService {
  constructor(
    @InjectRepository(Cert)
    private readonly certRepository: Repository<Cert>,
  ) {}

  findAll() {
    return this.certRepository.find();
  }
}
