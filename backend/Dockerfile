# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the code
COPY . .

# Expose backend port
EXPOSE 8000

# Start the backend in production mode
CMD ["npm", "start"]
