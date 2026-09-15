import { DataSource } from 'typeorm';

/**
 * Stops a script that is about to work against a schema older than the code.
 *
 * Seeds and migrations are separate on purpose - the seed scripts only insert
 * data, the schema is the migrations' business - but that leaves a gap the
 * database reports badly. Seeding into a schema that is missing a column an
 * entity declares fails deep inside TypeORM with `column Project.url does not
 * exist`, which says nothing about the migration that was never run. The API
 * runs pending migrations when it boots (see `app.module.ts`), so a database
 * only ever drifts when the seeds are run against it without the API having
 * started first.
 *
 * Nothing is changed here, not even a migration that is clearly pending:
 * running one against a schema that was created by hand, or by an older
 * `synchronize: true`, would fail on tables that already exist. Saying what to
 * run is more useful than guessing.
 */
export async function abortIfMigrationsPending(
  dataSource: DataSource,
): Promise<void> {
  if (!(await dataSource.showMigrations())) return;

  console.error(
    [
      '',
      '❌ The database schema is behind the code: some migrations have not run.',
      '',
      '   Run them first, then try again:',
      '     npm run migration:run',
      '',
      '   `npm run migration:show` lists what is pending. If a migration is',
      '   pending only because the schema was created some other way, mark it',
      '   as done instead: npm run migration:run -- --fake',
      '',
    ].join('\n'),
  );

  await dataSource.destroy();
  process.exit(1);
}
