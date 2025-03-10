import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/vendor/orders",
        destination: "/vendor/orders/pending",
        permanent: true, // Set to `true` for a 301 (permanent) redirect or `false` for a 302 (temporary) redirect
      },
    ];
  },
};

export default nextConfig;
