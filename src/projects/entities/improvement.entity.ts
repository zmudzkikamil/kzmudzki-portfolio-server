import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Improvement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  improvement: string;

  @Column({ nullable: true })
  description?: string;

  @Column('simple-array', { nullable: true }) // Optional array of detailed descriptions
  descriptionDetails?: string[];

  @ManyToOne(() => Project, (project) => project.improvements, {
    onDelete: 'CASCADE',
  })
  project: Project;
}
