FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npx tsc

EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]
