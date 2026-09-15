import { postgresSsl } from './postgres-ssl';

describe('postgresSsl', () => {
  const hosted =
    'postgresql://postgres.abc:pw@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';
  const local = 'postgres://postgres:postgres@localhost:5432/portfolio';

  // The arguments default to these, so they are cleared to keep the cases
  // below from picking up whatever the machine running the tests has set.
  const { DATABASE_URL, DATABASE_SSL } = process.env;
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.DATABASE_SSL;
  });
  afterAll(() => {
    process.env.DATABASE_URL = DATABASE_URL;
    process.env.DATABASE_SSL = DATABASE_SSL;
  });

  it('encrypts a connection to a hosted database', () => {
    expect(postgresSsl(hosted)).toEqual({ rejectUnauthorized: false });
  });

  it('connects to a database on this machine in the clear', () => {
    expect(postgresSsl(local)).toBe(false);
    expect(postgresSsl('postgres://postgres@127.0.0.1:5432/portfolio')).toBe(
      false,
    );
    expect(postgresSsl('postgres://postgres@[::1]:5432/portfolio')).toBe(false);
  });

  it('reads the host past a password that would break a naive parse', () => {
    expect(postgresSsl('postgres://user:p@ss:word@localhost:5432/db')).toBe(
      false,
    );
  });

  it('stays encrypted when there is no url to inspect', () => {
    expect(postgresSsl(undefined)).toEqual({ rejectUnauthorized: false });
  });

  it('lets DATABASE_SSL have the last word', () => {
    expect(postgresSsl(local, 'true')).toEqual({ rejectUnauthorized: false });
    expect(postgresSsl(hosted, 'false')).toBe(false);
    expect(postgresSsl(hosted, ' OFF ')).toBe(false);
  });
});
