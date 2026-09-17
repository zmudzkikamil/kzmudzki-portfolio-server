import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Włóczką Pisane is a Next.js shop - server rendering, a CMS, Stripe webhooks
 * and stock kept in Sanity - so it sat oddly under the React exercises it was
 * seeded alongside. It moves to a full-stack category of its own, which the
 * portfolio lists ahead of the rest.
 *
 * The seed cannot carry this on its own: it inserts only the projects missing
 * from the database and leaves the ones already there untouched, so every
 * environment seeded before this change keeps the old category until the
 * statement below runs.
 */
export class MoveWloczkapisaneToFullstack1789653783654
  implements MigrationInterface
{
  name = 'MoveWloczkapisaneToFullstack1789653783654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "project" SET "category" = 'fullstack' WHERE "id" = 'wloczkapisane'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "project" SET "category" = 'react' WHERE "id" = 'wloczkapisane'`,
    );
  }
}
