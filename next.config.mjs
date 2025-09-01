/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
      images: {
    domains: ['i.imgur.com', "lh3.googleusercontent.com", "firebasestorage.googleapis.com", 'imgur.com', 'res.cloudinary.com'], 
  },
  compress: true, 
};

export default nextConfig;
