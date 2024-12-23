import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { View } from './view.entity';
import { Improvement } from './improvement.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Project {
  @ApiProperty({ example: '1234', description: 'Unique project ID' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({
    example: 'Web Development',
    description: 'Category of the project',
  })
  @Column()
  category: string;

  @ApiProperty({
    example: 'Portfolio Website',
    description: 'Title of the project',
  })
  @Column()
  title: string;

  @ApiProperty({
    example: 'image.png',
    description: 'Path to the project image',
  })
  @Column()
  image: string;

  @ApiProperty({
    example: ['React', 'Node.js'],
    description: 'Skills or technologies used in the project',
  })
  @Column('simple-array')
  skills: string[];

  @ApiProperty({
    example: ['Feature 1', 'Feature 2'],
    description: 'Details about the project',
    nullable: true,
  })
  @Column('simple-array', { nullable: true })
  details?: string[];

  @ApiProperty({
    example: ['React', 'Tailwind CSS'],
    description: 'Technologies used in the project',
    nullable: true,
  })
  @Column('simple-array', { nullable: true })
  technologies?: string[];

  @ApiProperty({ description: 'List of views related to the project' })
  @OneToMany(() => View, (view) => view.project, { cascade: true })
  views: View[];

  @ApiProperty({
    description: 'List of improvements suggested for the project',
  })
  @OneToMany(() => Improvement, (improvement) => improvement.project, {
    cascade: true,
  })
  improvements: Improvement[];
}
