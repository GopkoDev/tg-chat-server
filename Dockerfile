FROM node:22-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

COPY package*.json tsconfig.json ./
COPY server.ts ./
COPY src ./src
COPY prisma ./prisma
COPY emails ./emails
COPY envconfig.ts envconfig.d.ts ./
COPY src/prisma-types.d.ts ./src/

RUN npm ci && \
    npm run build && \
    npm prune --production

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=hono:nodejs /app/prisma /app/prisma
COPY --from=builder --chown=hono:nodejs /app/emails /app/emails

RUN mkdir -p /app/logs && chown -R hono:nodejs /app/logs

USER hono
EXPOSE 3000

CMD ["/bin/sh", "-c", "npm run migrate && node /app/dist/server.js"] 