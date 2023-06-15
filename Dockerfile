FROM node:bookworm-slim as base

WORKDIR /app

COPY package.json .
RUN npm install

# Setup production node_modules
FROM base as production-deps

WORKDIR /app

COPY --from=base /app/node_modules /app/node_modules
ADD package.json ./
RUN npm prune --omit=dev

# Build the app
FROM base as builder

WORKDIR /app

COPY --from=base /app/node_modules /app/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build:css
RUN npm run build

# Finally, build the production image with minimal footprint
FROM node:bookworm-slim

ENV PORT="3000"
ENV NODE_ENV="production"

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --chown=node:node --from=production-deps /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --chown=node:node --from=builder /app/build ./build
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/package.json ./
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/server.js ./

EXPOSE 3000

CMD ["npm", "run" ,"start:migrate"]