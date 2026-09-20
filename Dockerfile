# =========================================================
# Stage 1: Build Stage (compile TypeScript & generate Prisma)
# =========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL and libc dependencies required by Prisma engine
RUN apk add --no-cache openssl libc6-compat

# Copy package manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for tsc)
RUN npm install

# Copy source code and TypeScript config
COPY tsconfig.json ./
COPY src ./src/

# Compile TypeScript to dist/ and generate Prisma client
RUN npm run build

# Remove devDependencies to produce clean production node_modules
RUN npm prune --production

# Re-generate Prisma Client inside production node_modules
RUN npx prisma generate

# =========================================================
# Stage 2: Production Runtime Stage (Lean & Secure)
# =========================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Install runtime dependencies for Prisma and process signal handling
RUN apk add --no-cache openssl dumb-init libc6-compat

# Default production environment variables
ENV NODE_ENV=production
ENV PORT=5942

# Create uploads directory if needed and assign permissions to node user
RUN mkdir -p /app/uploads && chown -R node:node /app

# Copy production node_modules, generated Prisma client, and compiled code
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/dist ./dist

# Switch to non-root user for security
USER node

# Expose backend service port
EXPOSE 5942

# Health check to ensure the container is responsive
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5942/ || exit 1

# Use dumb-init to properly forward SIGTERM/SIGINT for graceful shutdown
CMD ["dumb-init", "node", "dist/server.js"]
