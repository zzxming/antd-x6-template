/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack(webpackConfig) {
        webpackConfig.module.rules.push({
            test: /\.svg$/,
            issuer: /\.(js|ts)x?$/,
            use: ['@svgr/webpack'],
        }); // 针对 SVG 的处理规则，使可以作为组件使用

        return webpackConfig;
    },
};

module.exports = nextConfig;
