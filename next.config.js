// next.config.mjs
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                // Permite imagens que venham de unsplash.com e
                // também, se necessário, de images.unsplash.com:
                hostname: 'unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
};

export default nextConfig;
