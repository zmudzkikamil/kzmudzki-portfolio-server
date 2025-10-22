import { DataSource } from 'typeorm';
import { Knowledge } from '../../knowledge/knowledge.entity';

export async function seedKnowledge(dataSource: DataSource): Promise<void> {
  const knowledgeRepository = dataSource.getRepository(Knowledge);

  // Check if data already exists
  const count = await knowledgeRepository.count();
  if (count > 0) {
    console.log('✓ Knowledge data already exists, skipping...');
    return;
  }

  console.log('Seeding knowledge data...');

  await knowledgeRepository.save([
    {
      category: 'basics',
      level: '85%',
      skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
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
    {
      category: 'testing',
      level: '70%',
      skills: [
        'Jest',
        'React Testing Library',
        'Cypress',
        'End-to-End Testing',
      ],
    },
    {
      category: 'backend',
      level: '60%',
      skills: ['Node.js', 'Nest.js', 'SQL', 'SQLite', 'postgreSQL'],
    },
    {
      category: 'other',
      level: '70%',
      skills: ['Git', 'Agile/Scrum', 'Webpack', 'AWS Cloud Services'],
    },
  ]);

  console.log('✓ Knowledge data seeded successfully');
}
