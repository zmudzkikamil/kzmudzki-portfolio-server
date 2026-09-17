/**
 * The browser origins this API accepts cross-origin requests from, taken from
 * CORS_ORIGINS.
 *
 * The site answers on both zkamil.eu and www.zkamil.eu, and which of the two a
 * visitor ends up on is a hosting setting rather than anything this repository
 * controls - promoting the www host in Vercel is enough to change the Origin
 * every browser sends. A list naming only one of the pair turns that setting
 * into a site-wide outage, and a well disguised one: the browser blocks the
 * response before any code sees it, so the frontend reports nothing more
 * specific than "Network Error". Each configured domain therefore admits its
 * www counterpart, and each www domain its bare one.
 *
 * Origins are also normalised through `URL`, because a trailing slash -
 * `https://zkamil.eu/` - is easy to paste into an environment variable and
 * never matches: the Origin header carries a scheme and a host, never a path.
 *
 * The pairing reads a registered domain as two labels, which covers zkamil.eu
 * and every other domain this serves. A name sitting under a multi-label
 * suffix - example.co.uk - is left alone, so list both of its hosts by hand if
 * one ever needs to reach this API.
 */

const DEFAULT_ORIGINS = 'http://localhost:5173';

const IPV4 = /^\d+(?:\.\d+){3}$/;

// The pair worth completing is a registered domain and its www host, which is
// the one a browser can land on either side of. A deeper name is left alone:
// prepending www. to `api.zkamil.eu` invents a host nobody serves, and an
// address literal or a single label such as `localhost` has no www form at
// all. An IPv6 hostname arrives bracketed, so it carries no dot.
function counterpartHostname(hostname: string): string | null {
  if (hostname.startsWith('www.')) return hostname.slice('www.'.length);

  const isRegisteredDomain =
    hostname.split('.').length === 2 && !IPV4.test(hostname);

  return isRegisteredDomain ? `www.${hostname}` : null;
}

function wwwCounterpart(origin: string): string | null {
  const url = new URL(origin);
  const hostname = counterpartHostname(url.hostname);
  if (!hostname) return null;

  url.hostname = hostname;
  return url.origin;
}

export function corsOrigins(
  configured: string | undefined = process.env.CORS_ORIGINS,
): string[] {
  const entries = (configured ?? DEFAULT_ORIGINS)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  const allowed = new Set<string>();

  for (const entry of entries) {
    let origin: string;
    try {
      origin = new URL(entry).origin;
    } catch {
      // Not something `URL` can take apart - a bare `zkamil.eu` with no scheme,
      // say. It is still what the operator asked for, so it goes through
      // untouched rather than being dropped on the floor.
      allowed.add(entry);
      continue;
    }

    allowed.add(origin);

    const counterpart = wwwCounterpart(origin);
    if (counterpart) allowed.add(counterpart);
  }

  return [...allowed];
}
