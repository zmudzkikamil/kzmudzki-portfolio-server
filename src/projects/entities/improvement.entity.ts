import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Improvement {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  improvement: string;

  @Column()
  description: string;

  @Column('simple-array', { nullable: true })
  descriptionDetails?: string[];

  @ManyToOne(() => Project, (project) => project.improvements)
  project: Project;
}
