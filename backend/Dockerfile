# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Start the server
CMD ["npm", "run", "dev"]  # Replace with your start script if different