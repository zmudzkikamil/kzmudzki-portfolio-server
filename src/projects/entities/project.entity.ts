import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { View } from './view.entity';
import { Improvement } from './improvement.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  category: string;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column('simple-array') // Store as a comma-separated string
  skills: string[];

  @OneToMany(() => View, (view) => view.project, { cascade: true })
  views: View[];

  @OneToMany(() => Improvement, (improvement) => improvement.project, {
    cascade: true,
  })
  improvements: Improvement[];
}
