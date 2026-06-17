# Admin frontend (Vite + React) — development image with hot reload
FROM node:22-alpine

WORKDIR /app

# pnpm is the package manager (pnpm-lock.yaml). Install it globally.
RUN npm install -g pnpm

# Install deps first for layer caching. --frozen-lockfile fails if the lock is stale.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the source (overridden by the bind mount in docker-compose).
COPY . .

EXPOSE 5174

# Host/port are passed from docker-compose `command` so HMR and CORS origin line up.
CMD ["pnpm", "dev"]
