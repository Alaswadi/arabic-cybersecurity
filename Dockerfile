# Use Node.js 18 as the base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and related files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build time
ENV NEXT_PUBLIC_SUPABASE_URL=https://xahxjhzngahtcuekbpnj.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NTI3NzcsImV4cCI6MjAzMTUyODc3N30.Nh8yCZtYJJnRBLGnB9LUqhBpkLhqDMpJgBpQk_aVwYM

# Create uploads directories
RUN mkdir -p public/uploads/blog public/uploads/services

# Build the application
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV production
ENV NEXT_PUBLIC_SUPABASE_URL=https://xahxjhzngahtcuekbpnj.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NTI3NzcsImV4cCI6MjAzMTUyODc3N30.Nh8yCZtYJJnRBLGnB9LUqhBpkLhqDMpJgBpQk_aVwYM

# Create uploads directories
RUN mkdir -p public/uploads/blog public/uploads/services && \
    chmod -R 755 public/uploads

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["node_modules/.bin/next", "start"]
