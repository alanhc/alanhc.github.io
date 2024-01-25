const withPWA = require('next-pwa')({
  dest: 'public'
})
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'akamai',
    path: '.',
  },
  env: {
    baseUrl: isProd ? "https://alanhc.github.io" : "http://localhost:3000",
    NEXT_PUBLIC_GOOGLE_ANALYTICS: "G-L5Z3CY454S",
    
    config: {
      title: "Alan Tseng",
      titleShort:"alanhc",
      description: "this is alanhc's website",
      fqdn: isProd ? "https://alanhc.github.io" : "http://localhost:3000",
      social: {
        twitterID:"@alanhc316"
      },
      image: {
        logo: "/logo.png",
        favicon: "/favicon.ico"
      }
    }
  },
  experimental: {
    mdxRs: false,
  }

}

module.exports = withPWA(withMDX(nextConfig));
