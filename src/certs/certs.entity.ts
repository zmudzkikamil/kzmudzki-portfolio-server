import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'timestamptz' })
  dateIssued: Date;

  @Column()
  icon: string;

  @Column({ type: 'timestamptz', nullable: true })
  expirationDate?: Date;
}
