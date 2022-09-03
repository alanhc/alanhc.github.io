/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env:{
    baseUrl: isProd?  "https://alanhc.github.io/" : "http://localhost:3000"
  }
}

module.exports = nextConfig
