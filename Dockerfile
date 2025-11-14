# Stage 1: Build the app
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your source code and build it
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files from previous stage to Nginx's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for web access
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
