/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // Optional: Add MDX support via @next/mdx
  // We'll handle MDX in a custom way for more control

  // Images configuration for future use
  images: {
    domains: [],
  },

  // Experimental features if needed
  experimental: {
    // appDir: true, // Already default in Next.js 13+
  },
};

module.exports = nextConfig;