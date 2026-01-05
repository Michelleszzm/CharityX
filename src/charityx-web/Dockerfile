
FROM node:18-alpine AS builder

ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /app


RUN corepack enable && corepack prepare pnpm@latest --activate


COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


COPY . .
RUN pnpm build:sit


FROM node:18-alpine AS runner

WORKDIR /app


RUN corepack enable && corepack prepare pnpm@latest --activate


#COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json


ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000


CMD ["pnpm", "start"]