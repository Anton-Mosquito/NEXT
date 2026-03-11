/** @type {import('@lhci/cli').LighthouseRcConfig} */
module.exports = {
  ci: {
    collect: {
      // Build & start the production server before auditing
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'started server on',
      startServerReadyTimeout: 30000,
      url: [
        'http://localhost:3000',
        'http://localhost:3000/posts',
      ],
      // 3 runs per URL → use median to eliminate single-run variance
      numberOfRuns: 3,
      settings: {
        // Simulate a mid-range mobile device on 3G (Lighthouse default)
        preset: 'desktop',
        // Throttle network to simulate real-world conditions
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        // Disable Chrome sandbox in CI (Docker/GitHub Actions)
        chromeFlags: '--no-sandbox --disable-gpu',
      },
    },

    assert: {
      // 'warn' = annotate PR without failing the check
      // 'error' = fail the required status check
      // Start with 'warn' to establish a baseline; tighten to 'error' later.
      preset: 'lighthouse:no-pwa',
      assertions: {
        // ─── Category scores (0–1) ────────────────────────────────────────
        'categories:performance':    ['warn', { minScore: 0.9 }],
        'categories:accessibility':  ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo':            ['warn', { minScore: 0.9 }],

        // ─── Core Web Vitals ──────────────────────────────────────────────
        // LCP: Largest Contentful Paint
        'largest-contentful-paint':  ['warn', { maxNumericValue: 2500 }],
        // FID proxy: Total Blocking Time
        'total-blocking-time':       ['warn', { maxNumericValue: 200 }],
        // CLS: Cumulative Layout Shift
        'cumulative-layout-shift':   ['warn', { maxNumericValue: 0.1 }],
        // FCP: First Contentful Paint
        'first-contentful-paint':    ['warn', { maxNumericValue: 1800 }],
        // TTI: Time to Interactive
        'interactive':               ['warn', { maxNumericValue: 3800 }],
        // Speed Index
        'speed-index':               ['warn', { maxNumericValue: 3400 }],

        // ─── Bundle / Resource budgets ────────────────────────────────────
        // Warn if total JS transferred exceeds 300 KB
        'total-byte-weight':         ['warn', { maxNumericValue: 307200 }],
        // Warn on render-blocking resources
        'render-blocking-resources': ['warn', { maxLength: 0 }],

        // ─── Accessibility quick-wins ─────────────────────────────────────
        'color-contrast':  ['warn', { minScore: 1 }],
        'image-alt':       ['warn', { minScore: 1 }],
        'document-title':  ['warn', { minScore: 1 }],
        'html-has-lang':   ['warn', { minScore: 1 }],
        'meta-description':['warn', { minScore: 1 }],
      },
    },

    upload: {
      // Free temporary public storage — no token required.
      // Reports are publicly accessible for a few days then auto-deleted.
      // Switch to 'lhci' target + LHCI server for permanent history.
      target: 'temporary-public-storage',
    },
  },
};
