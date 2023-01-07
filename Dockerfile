FROM node:slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /borda

ADD package.json ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /borda

COPY --from=deps /borda/node_modules /borda/node_modules
ADD package.json ./
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /borda

COPY --from=deps /borda/node_modules /borda/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

ENV PORT="3000"
ENV NODE_ENV="production"

WORKDIR /borda

COPY --from=production-deps /borda/node_modules /borda/node_modules
COPY --from=build /borda/node_modules/.prisma /borda/node_modules/.prisma

COPY --from=build /borda/build /borda/build
COPY --from=build /borda/public /borda/public
COPY --from=build /borda/package.json /borda/package.json
# COPY --from=build /borda/start.sh /borda/start.sh
COPY --from=build /borda/prisma /borda/prisma

EXPOSE 3000

# ENTRYPOINT [ "./start.sh" ]
CMD ["npm", "run" ,"start"]