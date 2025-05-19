# Use Node.js 18 as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and related files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Make all scripts executable
RUN chmod +x *.sh

# Create a .env.local file with environment variables
RUN echo "NEXT_PUBLIC_SUPABASE_URL=https://xahxjhzngahtcuekbpnj.supabase.co" > .env.local && \
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDg5MDksImV4cCI6MjA2MjQ4NDkwOX0.S77Knjse4ZQCcHBfjai7Cu1ThcElR60_iV23huRWa3E" >> .env.local && \
    echo "NEXT_FORCE_DYNAMIC=1" >> .env.local

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_SUPABASE_URL=https://xahxjhzngahtcuekbpnj.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDg5MDksImV4cCI6MjA2MjQ4NDkwOX0.S77Knjse4ZQCcHBfjai7Cu1ThcElR60_iV23huRWa3E
# Force dynamic rendering
ENV NEXT_FORCE_DYNAMIC=1

# Create uploads directories
RUN mkdir -p public/uploads/blog public/uploads/services && \
    chmod -R 755 public/uploads

# Make sure admin directory exists and is properly configured
RUN mkdir -p app/admin && \
    echo "export const dynamic = 'force-dynamic'; export const generateStaticParams = () => { return [] };" > app/admin/config.ts

# Build the application with admin pages included
RUN node direct-build.js

# Expose the port the app will run on
EXPOSE 3000

# Start the application with dynamic rendering
CMD ["node", "direct-start.js"]
