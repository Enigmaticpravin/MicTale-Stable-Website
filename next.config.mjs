/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
      images: {
    domains: ['i.imgur.com', "scontent-itm1-1.cdninstagram.com", "images.unsplash.com", "plus.unsplash.com","lh3.googleusercontent.com", "firebasestorage.googleapis.com", 'imgur.com', 'res.cloudinary.com', 'scontent.cdninstagram.com'], 
  },
  compress: true, 
};

export default nextConfig;
