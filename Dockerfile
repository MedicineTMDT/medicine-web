# ==========================================
# GIAI ĐOẠN 1: CÀI ĐẶT THƯ VIỆN
# ==========================================
FROM node:18-alpine AS deps
WORKDIR /app

# Khuyến cáo từ Next.js: Cài libc6-compat để hỗ trợ một số thư viện lõi (như sharp) trên nền Alpine Linux
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci

# ==========================================
# GIAI ĐOẠN 2: BUILD CODE
# ==========================================
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ép Next.js nhận diện URL ngay từ lúc build proxy
ARG BACKEND_URL="http://medicine-backend:8080"
ENV BACKEND_URL=$BACKEND_URL

ARG CHATBOT_URL="http://medicine-chatbot:8000"
ENV CHATBOT_URL=$CHATBOT_URL

# Tắt gửi dữ liệu ẩn về Vercel để tăng tốc build
ENV NEXT_TELEMETRY_DISABLED 1

# Chạy lệnh build Next.js
RUN npm run build

# ==========================================
# GIAI ĐOẠN 3: CHẠY ỨNG DỤNG (Bản chuẩn Production)
# ==========================================
FROM node:18-alpine AS runner
WORKDIR /app

# Thiết lập môi trường Production
RUN apk update && apk upgrade --no-cache
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Cài đặt sharp độc lập trong môi trường chạy để nén ảnh mượt mà, không tốn CPU
RUN npm install sharp

# Copy các thư mục cần thiết từ Giai đoạn 2 sang
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT 3000

# Khởi động Next.js
CMD ["npm", "start"]