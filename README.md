# Borda

**Борда** - это сайт для проведения [CTF соревнований](https://ctftime.org/ctf-wtf/)

## Как устроен сайт

In progress...

## Как запуcтить локально

Для работы с сайтом потребуется [Node.js](https://nodejs.org/en/) и npm, и [Docker](https://docs.docker.com/engine/install/) или [PostgreSQL](https://www.postgresql.org/download/).

Чтобы запустить Борду локально, нужно:

1. Скачать репозиторий.
2. Сделать копию файла `.env.dev` и назвать его `.env`. Задать в нём нужные переменные окружения.
3. Установить зависимости:

        npm install

4. Запустить базу данных:

       docker run --name POSTGRES -p 5432:5432 -e POSTGRES_PASSWORD=secure-password postgres:alpine

5. Выполнить миграцию для создания таблиц базы данных с помощью Prisma Migrate:

        npx prisma db push
        npx prisma db seed

    > Посмотреть записи в базе данных в Prisma Studio
    >
    >     npx prisma studio

6. Запустить локальный веб-сервер:

        npm run dev

## How to run the app in production mode

1. Build project with command `npm run build`
2. Launch database
3. Run app with command `npm start`

> Make sure to deploy the output of `remix build` command
>
> - `build/`
> - `public/build/`

## Полезные материалы

- [Prisma guide](https://www.youtube.com/watch?v=RebA5J-rlwg)
- [Remix crash course](https://www.youtube.com/watch?v=d_BhzHVV4aQ)
- [Remix/React state guide](https://www.youtube.com/watch?v=sFTGEs2WXQ4)
- [Remix routing](https://www.youtube.com/watch?v=ds_evK0jeHM)
- [Remix examples](https://github.com/remix-run/remix/tree/main/examples)
