// Purges the Cloudflare cache right after a Netlify deploy goes live.
//
// Why this exists: curiocrate.org is proxied through Cloudflare in front of Netlify.
// public/_headers caches everything under /assets/* as `immutable` for a year, keyed by
// Vite's content-hashed filenames. That's safe *if* Cloudflare only ever caches the real
// file — but during the brief window right after a new deploy goes live, Netlify's own
// CDN can still be propagating the new asset files across its edges. If a request for a
// brand-new hashed filename lands in that gap, it gets Netlify's SPA-fallback HTML back
// with a 200 status, and Cloudflare — matching by URL pattern, not by what was actually
// returned — caches that broken HTML response under the immutable header for a year. Once
// that happens, no amount of hard-refreshing fixes it; only a cache purge does. See the
// "Deploy/caching (Netlify + Cloudflare)" section of CLAUDE.md for the full incident.
//
// Purging everything right after each deploy closes that window: any visitor request
// during the propagation gap will 404/retry rather than getting permanently cached.
//
// Requires two Netlify environment variables (Site settings -> Environment variables):
//   CLOUDFLARE_API_TOKEN — a Cloudflare API token scoped to "Zone.Cache Purge" for this zone
//   CLOUDFLARE_ZONE_ID   — the Zone ID for curiocrate.org (Cloudflare dashboard -> Overview,
//                          right sidebar)
// If either is missing, this plugin logs a warning and skips the purge rather than failing
// the deploy — a missing purge shouldn't block shipping a real code change.
module.exports = {
  onSuccess: async () => {
    const token = process.env.CLOUDFLARE_API_TOKEN
    const zoneId = process.env.CLOUDFLARE_ZONE_ID

    if (!token || !zoneId) {
      console.log('[cloudflare-purge] CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID not set — skipping cache purge.')
      return
    }

    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purge_everything: true }),
      })
      const data = await res.json()

      if (!data.success) {
        console.error('[cloudflare-purge] Cloudflare purge failed:', JSON.stringify(data.errors || data))
        return
      }

      console.log('[cloudflare-purge] Cloudflare cache purged successfully.')
    } catch (err) {
      console.error('[cloudflare-purge] Cloudflare purge request errored:', err.message)
    }
  },
}
