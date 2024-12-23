import { Module } from '@nestjs/common';
import { CertsController } from './certs.controller';
import { CertsService } from './certs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cert } from './certs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cert])],
  controllers: [CertsController],
  providers: [CertsService],
})
export class CertsModule {}
