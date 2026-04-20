/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "imagedelivery.net" },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/cf-img/:path*",
        destination: "https://imagedelivery.net/:path*",
      },
      {
        source: "/dict/:word",
        destination: "https://api.dictionaryapi.dev/api/v2/entries/en/:word",
      },
      {
        source: "/api/:path*",
        destination: "https://naila-api-kids-production.up.railway.app/api/:path*",
      },
      {
        source: "/rsc-api/:path*",
        destination: "https://naila-api-kids-production.up.railway.app/rsc-api/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=30, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
