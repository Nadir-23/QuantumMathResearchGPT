/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/:path*'
        }
      ]
    }
  }
}

module.exports = nextConfig
