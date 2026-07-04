FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

FROM node:18-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 express

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=express:nodejs src ./src
COPY --chown=express:nodejs database ./database
COPY --chown=express:nodejs package.json ./

RUN mkdir -p uploads && chown express:nodejs uploads

USER express

EXPOSE 5000

CMD ["node", "src/server.js"]
