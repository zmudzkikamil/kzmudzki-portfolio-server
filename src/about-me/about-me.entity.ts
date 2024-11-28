import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AboutMe {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  year: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  icon: string;
}
