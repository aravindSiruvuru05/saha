# Use the official node image as a build environment
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build the app
RUN npm run build

