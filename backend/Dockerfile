# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy the rest of the backend source code
COPY . .

# Expose backend port (adjust if needed)
EXPOSE 8000

# Default command to start backend
CMD ["node", "index.js"]