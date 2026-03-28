/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile three.js packages
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  
  // Handle webpack for Three.js
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;
