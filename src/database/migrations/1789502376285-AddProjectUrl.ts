import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * A project can now carry the address of its live site, so the portfolio can
 * invite visitors to go and look at the real thing. Nullable: most of the
 * projects are exercises with nothing deployed to link to.
 */
export class AddProjectUrl1789502376285 implements MigrationInterface {
  name = 'AddProjectUrl1789502376285';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" ADD "url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "url"`);
  }
}
