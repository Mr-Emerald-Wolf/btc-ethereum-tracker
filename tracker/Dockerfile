# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package.json package-lock.json ./

# Install all the dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Start the scraper by running the tracker service or entry file
CMD ["node", "index.js"]
