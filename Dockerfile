# ----------- Builder Stage -----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of the app
COPY . .

# ----------- Production Stage -----------
FROM node:18-alpine

WORKDIR /app

# Copy only what's needed from builder
COPY --from=builder /app ./

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 4000

# Start the app
CMD ["node", "app.js"]
