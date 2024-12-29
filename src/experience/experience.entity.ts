import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Position } from './position.entity';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  company: string;

  @Column()
  period: string;

  @OneToMany(() => Position, (position) => position.experience, {
    cascade: true,
  })
  positions: Position[];
}
