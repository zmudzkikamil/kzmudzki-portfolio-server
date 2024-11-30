import { Knowledge } from '../../knowledge/knowledge.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedKnowledgeData1732994072794 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const knowledgeRepository =
      await queryRunner.manager.getRepository(Knowledge);

    await knowledgeRepository.insert([
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
    await queryRunner.manager.delete(Knowledge, {});
  }
}
