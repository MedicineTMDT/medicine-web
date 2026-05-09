// Lấy URL từ biến môi trường
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
const CHATBOT_URL = process.env.CHATBOT_URL || "http://localhost:8000";

const nextConfig = {
  // 1. Cấu hình cho phép lấy ảnh từ domain bên ngoài
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trungtamthuoc.com',
      },
      {
        protocol: 'http',
        hostname: 'trungtamthuoc.com',
      },
      // Bổ sung luôn domain của Google để ảnh đại diện user không bị lỗi khi làm Google Auth
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', 
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },

  // 2. Ép bỏ qua lỗi để build Docker (Giữ nguyên cấu hình cũ của bạn)
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // 3. Cấu hình Proxy cho Frontend gọi Backend/Chatbot
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
      {
        source: "/chatbot/:path*",
        destination: `${CHATBOT_URL}/:path*`,
      },
    ];
  },
};

// Bắt buộc dùng export default cho file .mjs
export default nextConfig;