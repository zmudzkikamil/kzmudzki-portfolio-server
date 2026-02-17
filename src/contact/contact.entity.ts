import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('contact_submissions')
export class ContactSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'text' })
  message: string;

  @Column()
  ip_address: string;

  @CreateDateColumn()
  submitted_at: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'sent' | 'failed';
}
