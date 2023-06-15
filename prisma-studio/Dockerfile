FROM node:bookworm-slim

WORKDIR /app

COPY /prisma-studio/package.json .
RUN npm install

ADD /prisma .
RUN npx prisma generate

EXPOSE 5555

CMD ["npx", "prisma" ,"studio"]