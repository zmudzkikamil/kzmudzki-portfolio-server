import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Experience } from './experience.entity';

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  period: string;

  @Column()
  description: string;

  @Column('simple-array') // Store skills as a comma-separated string
  skills: string[];

  @ManyToOne(() => Experience, (experience) => experience.positions)
  experience: Experience;
}
