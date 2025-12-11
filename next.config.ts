import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**'
            },
            new URL('https://picsum.photos/seed/**/**/300')
        ]
    }
}

export default nextConfig;
