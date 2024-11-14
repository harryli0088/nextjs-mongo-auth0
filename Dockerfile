FROM node:lts-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Create a lightweight image to serve the app
FROM node:lts-alpine AS runner

WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

# Expose the port for the Next.js app
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]