# Borda

**Борда** - это сайт для проведения [CTF соревнований](https://ctftime.org/ctf-wtf/)

## Как устроен сайт

In progress...

## Как запуcтить локально

Для работы с сайтом потребуется [Node.js](https://nodejs.org/en/) и npm, и [Docker](https://docs.docker.com/engine/install/) или [PostgreSQL](https://www.postgresql.org/download/).

Чтобы запустить Борду локально, нужно:

1. Скачать репозиторий.
2. Сделать копию файла `.env.dev` и назвать его `.env`. Задать в нём нужные переменные окружения.
3. Установить зависимости командой `npm i`.
4. Запустить базу данных. Подробнее в [руководстве по запуску PostgreSQL](docs/how-to-run-postgresql.md)
5. Применить миграции к базе данных командой `npx prisma db push`
6. Запустить локальный веб-сервер командой `npm run dev`.

Больше вариантов локального запуска Борды — [в руководстве по запуску](docs/how-to-run.md).

## Полезные материалы

- [Prisma guide](https://www.youtube.com/watch?v=RebA5J-rlwg)
- [Remix crash course](https://www.youtube.com/watch?v=d_BhzHVV4aQ)
- [Remix/React state guide](https://www.youtube.com/watch?v=sFTGEs2WXQ4)
- [Remix routing](https://www.youtube.com/watch?v=ds_evK0jeHM)
- [Remix examples](https://github.com/remix-run/remix/tree/main/examples)
