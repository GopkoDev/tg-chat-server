FROM node:22-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

COPY package*.json tsconfig.json ./
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

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/server.js"] 