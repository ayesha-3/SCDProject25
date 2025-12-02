# Use Node.js LTS as base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all project files into container
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Start the Node.js application
CMD ["node", "main.js"]
