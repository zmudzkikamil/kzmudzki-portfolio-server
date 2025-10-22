import { DataSource } from 'typeorm';
import { Cert } from '../../certs/certs.entity';

export async function seedCerts(dataSource: DataSource): Promise<void> {
  const certsRepository = dataSource.getRepository(Cert);

  // Check if data already exists
  const count = await certsRepository.count();
  if (count > 0) {
    console.log('✓ Certs data already exists, skipping...');
    return;
  }

  console.log('Seeding certs data...');

  await certsRepository.save([
    {
      name: 'AWS Certified Developer - Associate',
      description:
        'Validates ability to develop and maintain applications on AWS.',
      dateIssued: 1719811200000,
      icon: 'fa-brands fa-aws',
      expirationDate: 1814400000000,
    },
    {
      name: 'Engineer Diploma - Lodz University of Technology',
      description:
        'Degree in Faculty of Electrical, Electronic, Computer and Control Engineering.',
      dateIssued: 1612137600000,
      icon: 'fa-solid fa-user-graduate',
    },
  ]);

  console.log('✓ Certs data seeded successfully');
}
