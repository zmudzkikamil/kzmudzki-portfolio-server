import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutMe } from './about-me.entity';
import { AboutMeController } from './about-me.controller';
import { AboutMeService } from './about-me.service';

@Module({
  imports: [TypeOrmModule.forFeature([AboutMe])],
  controllers: [AboutMeController],
  providers: [AboutMeService],
})
export class AboutMeModule {}
