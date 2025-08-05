FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    wget \
    curl \
    ca-certificates \
    bash \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Create shared repos directory
RUN mkdir -p /shared/repos

# NOTE: This Dockerfile currently serves only the backend API on port 3000
# To serve the Angular frontend from the same container, additional changes would be needed:
# 1. Build the Angular app: RUN npm run frontend:build  
# 2. Copy build output to backend's public directory
# 3. Update backend/index.ts to serve static files in production mode
# For now, frontend runs separately on port 4200 with proxy configuration

# Copy package files first for better Docker layer caching
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install all workspace dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
WORKDIR /app
COPY . .

# Build backend
RUN npm run backend:build

# Copy and set up the Git credentials script
COPY backend/scripts/setup-git-credentials.sh /usr/local/bin/setup-git-credentials.sh
RUN chmod +x /usr/local/bin/setup-git-credentials.sh

# Create non-root user for security
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app && \
    chown -R appuser:appgroup /shared/repos

# Switch to non-root user
USER appuser

# Create necessary directories with proper permissions
RUN mkdir -p /app/logs /app/config

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV SHELL=/bin/bash

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Use the Git setup script as entrypoint
ENTRYPOINT ["/usr/local/bin/setup-git-credentials.sh"]

# Default command - start the backend API server
CMD ["npm", "run", "backend:start"]
