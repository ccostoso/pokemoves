import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    output: "standalone",
    allowedDevOrigins: process.env.DEV_ORIGIN ? [process.env.DEV_ORIGIN] : [],
    serverExternalPackages: ["@prisma/client", "pg"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "raw.githubusercontent.com",
            },
        ],
    },
}

export default nextConfig