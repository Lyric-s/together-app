# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy files of dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build for the web with Expo
RUN npm run build:web

# Production stage
FROM nginx:alpine

RUN apk add --no-cache wget

# Copy built files (Expo generates in dist/)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]