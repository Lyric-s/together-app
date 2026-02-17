# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy files of dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

ARG EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL
<<<<<<< HEAD
RUN if [ -z "$EXPO_PUBLIC_API_URL" ]; then echo "ERREUR : EXPO_PUBLIC_API_URL est vide au moment du build !"; exit 1; fi
=======
>>>>>>> b678e8c (fix: TA-132 modif and add env variable)

# Copy the rest of the application code
COPY . .

ARG EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

RUN if [ -z "$EXPO_PUBLIC_API_URL" ]; then echo "ERREUR : EXPO_PUBLIC_API_URL est vide au moment du build !"; exit 1; fi

# Build for the web with Expo
RUN npm run build:web

# Production stage
FROM nginx:alpine

RUN apk add --no-cache wget

# Copy built files (Expo generates in dist/)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]