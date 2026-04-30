# ==========================================
# GIAI ĐOẠN 1: CÀI ĐẶT THƯ VIỆN
# ==========================================
FROM node:18-alpine AS deps
WORKDIR /app

# Copy các file quản lý thư viện vào trước
COPY package.json package-lock.json* ./
# Cài đặt chính xác các phiên bản thư viện (dùng npm ci sẽ nhanh và chuẩn hơn npm install)
RUN npm ci

# ==========================================
# GIAI ĐOẠN 2: BUILD CODE
# ==========================================
FROM node:18-alpine AS builder
WORKDIR /app

# Lấy thư viện đã cài ở Giai đoạn 1 sang
COPY --from=deps /app/node_modules ./node_modules
# Copy toàn bộ source code
COPY . .

# ---> THÊM 2 DÒNG NÀY VÀO ĐÂY <---
# Ép Next.js nhận diện URL của backend ngay từ lúc build proxy
ARG BACKEND_URL="http://medicine-backend:8080"
ENV BACKEND_URL=$BACKEND_URL

# Chạy lệnh build Next.js
RUN npm run build

# ==========================================
# GIAI ĐOẠN 3: CHẠY ỨNG DỤNG (Bản nhẹ nhất)
# ==========================================
FROM node:18-alpine AS runner
WORKDIR /app

# Thiết lập môi trường Production
RUN apk update && apk upgrade --no-cache
ENV NODE_ENV production

# Copy các thư mục và file cần thiết để chạy web từ Giai đoạn 2 sang
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Next.js mặc định chạy ở port 3000
EXPOSE 3000
ENV PORT 3000

# Khởi động Next.js
CMD ["npm", "start"]