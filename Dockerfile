# Stage 1: Build the Vite React App
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json* ./
RUN npm ci

# Copy code and build
COPY . .
RUN npm run build

# Stage 2: Serve the app with Node.js Backend Proxy
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy built frontend assets from builder
COPY --from=builder /app/dist ./dist

# Copy the backend server code
COPY server.js ./

# Expose port 8080 as required by Google Cloud Run
EXPOSE 8080

# Environment variables will be injected by Cloud Run at runtime
# GCP_PROJECT_ID is provided by the environment

# Start the unified backend + frontend server
CMD ["node", "server.js"]
