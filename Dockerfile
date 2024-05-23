# Use Node.js as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 4173

# Command to run the application
CMD ["npm", "run", "preview"]
