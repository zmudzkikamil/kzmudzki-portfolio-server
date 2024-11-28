import { QueryRunner } from 'typeorm';
import { Knowledge } from '../../knowledge/knowledge.entity';

export class SeedKnowledge {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert initial data into the 'knowledge' table
    await queryRunner.manager.insert(Knowledge, [
      {
        category: 'basics',
        level: '80%',
        skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript'], // skills should be an array
      },
      {
        category: 'react',
        level: '85%',
        skills: [
          'React.js',
          'React Hook Form',
          'React Query',
          'Zod',
          'TanStack Table',
          'React Router',
        ],
      },
      {
        category: 'styling',
        level: '75%',
        skills: ['SCSS', 'Tailwind CSS', 'Styled Components', 'CSS Modules'],
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete all data from the 'knowledge' table (optional, if you need to roll back the seeder)
    await queryRunner.manager.delete(Knowledge, {});
  }
}
