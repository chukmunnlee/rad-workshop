FROM node:19

WORKDIR /app

ADD package.json .
ADD package-lock.json .
ADD database.js .
ADD main.js .
ADD util.js .

ADD data data

RUN npm ci

ENV PORT=3000

EXPOSE ${PORT}

ENTRYPOINT node main.js
