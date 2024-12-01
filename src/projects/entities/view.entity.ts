import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class View {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  image: string;

  @ManyToOne(() => Project, (project) => project.views)
  project: Project;
}
