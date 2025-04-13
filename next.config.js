// next.config.mjs
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'qzorbvpxrpshsvhgvtjo.supabase.co',
            },
        ],
    },
};

export default nextConfig;
