/** @type {import('next').NextConfig} */
const nextConfig = {reactStrictMode: false}

module.exports = {
    reactStrictMode: false,
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'media.sketchfab.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'static.inaturalist.org',
            port: '',
            pathname: '/**'
          },
          {
            protocol: 'https',
            hostname: 'inaturalist-open-data.s3.amazonaws.com',
            port: '',
            pathname: '/**'
          }

        ],
      }
}
