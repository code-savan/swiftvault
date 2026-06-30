/**
 * Runs once on the server before any other code executes.
 *
 * Ensures Node.js trusts the macOS system CA bundle for outbound HTTPS
 * (Supabase, Paystack, Twilio, SMS-Activate). Without this, Node 20+ on macOS
 * can fail with `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` because it no longer
 * automatically uses the OS trust store.
 *
 * This runs in the Node.js process (server side only) and is a no-op on
 * platforms where the cert file doesn't exist (e.g. production Linux/Vercel
 * uses a different path or already trusts the bundle).
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { existsSync } = require('node:fs') as typeof import('node:fs')

  const candidates = [
    process.env.NODE_EXTRA_CA_CERTS,
    process.env.SSL_CERT_FILE,
    '/etc/ssl/cert.pem',
    '/etc/ssl/certs/ca-certificates.crt',
    '/etc/pki/tls/certs/ca-bundle.crt',
    '/etc/ssl/certs/bundle.ca',
  ]

  const certPath = candidates.find((p) => p && existsSync(p))

  if (certPath && !process.env.NODE_EXTRA_CA_CERTS) {
    process.env.NODE_EXTRA_CA_CERTS = certPath
    if (!process.env.SSL_CERT_FILE) process.env.SSL_CERT_FILE = certPath
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[instrumentation] using CA bundle: ${certPath}`)
    }
  }
}
