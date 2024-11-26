import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutMeModule } from './about-me/about-me.module';
import { ExperienceModule } from './experience/experience.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      autoLoadEntities: true, // Automatically load entities
      synchronize: true, // Synchronizes schema; disable in production!
    }),
    AboutMeModule,
    ExperienceModule,
  ],
})
export class AppModule {}
