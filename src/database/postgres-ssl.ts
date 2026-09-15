/**
 * Whether the Postgres connection should be encrypted, in the shape TypeORM
 * and `pg` expect.
 *
 * Supabase accepts nothing but encrypted connections, and serves a self-signed
 * certificate on the smaller plans - which is why verification is switched
 * off rather than the encryption itself. A Postgres running on a developer's
 * own machine ships with `ssl = off`, and asking such a server for SSL does
 * not degrade gracefully: `pg` fails the connection outright with "The server
 * does not support SSL connections". So a local URL connects in the clear and
 * everything else stays encrypted.
 *
 * DATABASE_SSL settles the cases the host name cannot: a local instance that
 * does have a certificate, or a remote one that does not want encryption.
 */

export type PostgresSsl = { rejectUnauthorized: boolean } | false;

const LOCAL_HOSTS = ['localhost', '127.0.0.1', '::1', '0.0.0.0'];

const SSL_OFF_VALUES = ['false', '0', 'off', 'no', 'disable'];

const ENCRYPTED: PostgresSsl = { rejectUnauthorized: false };

function isLocalHost(url: string): boolean {
  try {
    // A Postgres URL parses as a URL, but a password can carry characters that
    // make it fail to - hence the coarser fallback rather than a throw.
    const { hostname } = new URL(url);
    return LOCAL_HOSTS.includes(hostname.replace(/^\[|\]$/g, ''));
  } catch {
    return LOCAL_HOSTS.some((host) => url.includes(`@${host}`));
  }
}

export function postgresSsl(
  url: string | undefined = process.env.DATABASE_URL,
  override: string | undefined = process.env.DATABASE_SSL,
): PostgresSsl {
  if (override) {
    return SSL_OFF_VALUES.includes(override.trim().toLowerCase())
      ? false
      : ENCRYPTED;
  }

  // Nothing to inspect: stay encrypted, which is what every hosted database
  // this connects to insists on.
  if (!url) return ENCRYPTED;

  return isLocalHost(url) ? false : ENCRYPTED;
}
