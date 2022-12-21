/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'akamai',
    path: '',
  },
  env:{
    baseUrl: isProd?  "https://alanhc.github.io" : "http://localhost:3000",
    NEXT_PUBLIC_GOOGLE_ANALYTICS: "G-L5Z3CY454S"
  },
  
}

module.exports = nextConfig
