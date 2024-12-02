import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { View } from './view.entity';
import { Improvement } from './improvement.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category: string;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column('simple-array') // For storing skills as a string array
  skills: string[];

  @Column('simple-array', { nullable: true }) // Optional details array
  details?: string[];

  @Column('simple-array', { nullable: true }) // Optional technologies array
  technologies?: string[];

  @OneToMany(() => View, (view) => view.project, { cascade: true })
  views: View[];

  @OneToMany(() => Improvement, (improvement) => improvement.project, {
    cascade: true,
  })
  improvements: Improvement[];
}
