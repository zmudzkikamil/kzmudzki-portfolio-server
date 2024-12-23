import { Cert } from '../../certs/certs.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCertsData1734955166995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const certsRepository = await queryRunner.manager.getRepository(Cert);

    await certsRepository.insert([
      {
        name: 'AWS Certified Developer - Associate',
        description:
          'Validates ability to develop and maintain applications on AWS.',
        dateIssued: 1719811200000,
        expirationDate: 1741344000000,
      },
      {
        name: 'Engineer Diploma - Lodz University of Technology',
        description:
          'Degree in Faculty of Electrical, Electronic, Computer and Control Engineering.',
        dateIssued: 1612137600000,
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(Cert, {});
  }
}
