# Use the official Node.js image as the base image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json tsconfig*.json ./

# Install the Node.js dependencies
RUN npm install

# Install the full Python environment
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install --upgrade pip

# Copy the microservice code to the container
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the microservice
CMD [ "npm", "build" ]
CMD [ "npm", "start" ]
