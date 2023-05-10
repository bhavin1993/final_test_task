/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    TOKEN: process.env.TOKEN
  },
}

module.exports = nextConfig
