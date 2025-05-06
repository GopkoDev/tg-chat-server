FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

FROM node:20-alpine as runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/envconfig.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/emails ./emails

EXPOSE 3000

CMD ["npm", "run", "start"] 