import { corsOrigins } from './cors-origins';

describe('corsOrigins', () => {
  // The argument defaults to this, so it is cleared to keep the cases below
  // from picking up whatever the machine running the tests has set.
  const { CORS_ORIGINS } = process.env;
  beforeEach(() => {
    delete process.env.CORS_ORIGINS;
  });
  afterAll(() => {
    process.env.CORS_ORIGINS = CORS_ORIGINS;
  });

  it('admits the www counterpart of a configured domain', () => {
    expect(corsOrigins('https://zkamil.eu')).toEqual([
      'https://zkamil.eu',
      'https://www.zkamil.eu',
    ]);
  });

  it('admits the bare domain behind a configured www host', () => {
    expect(corsOrigins('https://www.zkamil.eu')).toEqual([
      'https://www.zkamil.eu',
      'https://zkamil.eu',
    ]);
  });

  it('keeps a pair configured by hand down to one entry each', () => {
    expect(corsOrigins('https://zkamil.eu,https://www.zkamil.eu')).toEqual([
      'https://zkamil.eu',
      'https://www.zkamil.eu',
    ]);
  });

  it('strips a trailing slash, which an Origin header never carries', () => {
    expect(corsOrigins('https://zkamil.eu/')).toContain('https://zkamil.eu');
  });

  it('reads a comma-separated list, spaces and blanks included', () => {
    expect(
      corsOrigins(' https://zkamil.eu , , http://localhost:5173 '),
    ).toEqual([
      'https://zkamil.eu',
      'https://www.zkamil.eu',
      'http://localhost:5173',
    ]);
  });

  it('leaves hosts that own no www counterpart alone', () => {
    expect(corsOrigins('http://localhost:5173')).toEqual([
      'http://localhost:5173',
    ]);
    expect(corsOrigins('http://127.0.0.1:5173')).toEqual([
      'http://127.0.0.1:5173',
    ]);
    expect(corsOrigins('http://[::1]:5173')).toEqual(['http://[::1]:5173']);
  });

  it('invents no counterpart for a host deeper than the registered domain', () => {
    expect(corsOrigins('https://api.zkamil.eu')).toEqual([
      'https://api.zkamil.eu',
    ]);
  });

  it('passes an entry it cannot parse through untouched', () => {
    expect(corsOrigins('zkamil.eu')).toEqual(['zkamil.eu']);
  });

  it('falls back to the dev server when nothing is configured', () => {
    expect(corsOrigins(undefined)).toEqual(['http://localhost:5173']);
  });

  it('reads CORS_ORIGINS when no argument is given', () => {
    process.env.CORS_ORIGINS = 'https://zkamil.eu';
    expect(corsOrigins()).toEqual([
      'https://zkamil.eu',
      'https://www.zkamil.eu',
    ]);
  });
});
