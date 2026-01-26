import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "jgiwosqdhbjviikombnu.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/**",
            },
        ],
        unoptimized: true,
    },

    experimental: {
        proxyPrefetch: "flexible",
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
