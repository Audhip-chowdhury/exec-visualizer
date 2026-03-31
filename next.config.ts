import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure the SQLite database file is bundled with every server route
  outputFileTracingIncludes: {
    "/*": ["./data/questions.db"],
  },
};

export default nextConfig;
