/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@coinbase/wallet-sdk'],
  webpack(config) {
    // Fix: Treat Coinbase worker as ESM
    config.module.rules.push({
      test: /HeartbeatWorker\.js$/,
      issuer: /@coinbase\/wallet-sdk/,
      type: 'javascript/esm',
    });

    return config;
  },
};

module.exports = nextConfig;
