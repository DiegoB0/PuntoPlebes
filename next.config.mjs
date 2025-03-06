/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
        // Optionally, you can add pathname and port constraints:
        // pathname: '/djdwvjmpr/**',
        // port: ''
      }
    ]
  }
}
export default nextConfig
