/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

export default nextConfig;//



// import { withSentryConfig } from "@sentry/nextjs";

// const sentryConfig = {
//   silent: true,
//   org: "smartercodes-xb",
//   project: "hybrid-c-chat-portal",
// };

// const sentryOptions = {
//   widenClientFileUpload: true,
//   transpileClientSDK: true,
//   tunnelRoute: "/monitoring",
//   hideSourceMaps: true,
//   disableLogger: true,
//   automaticVercelMonitors: true,
// };

// export default withSentryConfig(nextConfig, sentryConfig, sentryOptions);
