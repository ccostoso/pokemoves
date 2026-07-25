import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    output: "standalone",
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