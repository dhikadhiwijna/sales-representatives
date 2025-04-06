# Use Node.js LTS for building the frontend
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Set environment variable for the backend API URL
# ARG BACKEND_URL
# ENV NEXT_PUBLIC_BACKEND_URL=$BACKEND_URL

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build && npm run export

# Expose the port for the Next.js development server
EXPOSE 3000

# Start the Next.js development server
CMD ["npm", "start"]
