import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/notes": ["./data/**/*"],
    "/api/notes/[id]": ["./data/**/*"],
  },
};

export default nextConfig;
