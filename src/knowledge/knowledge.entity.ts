import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Knowledge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  level: string;

  @Column('simple-array') // TypeORM can map arrays as strings
  skills: string[];
}
