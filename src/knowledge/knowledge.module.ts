import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeService } from './knowledge.service';
import { KnowledgeController } from './knowledge.controller';
import { Knowledge } from './knowledge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Knowledge])],
  providers: [KnowledgeService],
  controllers: [KnowledgeController],
})
export class KnowledgeModule {}
