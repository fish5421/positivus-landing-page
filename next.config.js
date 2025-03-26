/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Optimize for production deployment
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  // Handle image domains if needed
  images: {
    domains: ['customer-cajhg5znip2cupqy.cloudflarestream.com'],
    unoptimized: true, // This can help with deployment issues
  },
};

module.exports = nextConfig;
