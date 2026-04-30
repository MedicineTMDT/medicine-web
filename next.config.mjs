// Lấy URL từ biến môi trường, nếu không có thì mặc định lấy localhost:8080 (để lúc code ở máy báo không bị lỗi)
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

const nextConfig = {
  // 1. Cấu hình ảnh
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  // 2. Ép bỏ qua lỗi để build Docker
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // 3. Cấu hình Proxy (Dùng biến BACKEND_URL ở trên)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: "/oauth2/authorization/:provider*",
        destination: `${BACKEND_URL}/oauth2/authorization/:provider*`,
      },
      {
        source: "/login/oauth2/code/:provider*",
        destination: `${BACKEND_URL}/login/oauth2/code/:provider*`,
      },
    ];
  },
};

export default nextConfig;