import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

module.exports = {
    images: {
        remotePatterns: [
            new URL('https://images.unsplash.com/photo-1669986480140-2c90b8edb443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBtb3VudGFpbnxlbnwxfHx8fDE3NjI5MzUwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080'),
            new URL('https://picsum.photos/seed/**/**/300')
        ]
    }
}

export default nextConfig;
