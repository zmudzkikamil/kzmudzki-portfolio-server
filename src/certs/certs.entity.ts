import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  dateIssued: number;

  @Column({ nullable: true })
  expirationDate?: number;
}
