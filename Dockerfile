# syntax=docker/dockerfile:1

FROM node:24-slim AS base
RUN corepack enable && corepack prepare pnpm@11.17.0 --activate

# deps
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm prisma generate

RUN pnpm build

# runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

# Requires `output: "standalone"` in next.config.ts -- traces
# actual runtime dependency graph into .next/standalone, so the final
# image doesn't drag in all of node_modules.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma's query engine binary is loaded dynamically at runtime, not via
# a static import — standalone tracing can miss it, so copy explicitly.
COPY --from=builder --chown=nextjs:nodejs /app/generated/prisma ./generated/prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]