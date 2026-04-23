# Stage 1: Build the Vite React App
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker layer caching for npm install
COPY package.json package-lock.json* ./

# Install dependencies using clean install for reproducible builds
RUN npm ci

# Copy the rest of the application code
COPY . .

# Force fresh build for API key

# Build the application for production
RUN npm run build

# Stage 2: Serve the app with Nginx (Minimal Footprint)
FROM nginx:alpine

# Remove default nginx static assets to keep it clean
RUN rm -rf /usr/share/nginx/html/*

# Copy the custom Nginx configuration optimized for Cloud Run and SPAs
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built artifacts from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 8080 as required by Google Cloud Run
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
