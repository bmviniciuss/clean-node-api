FROM node:12-alpine

WORKDIR /usr/src/clean-node-api

COPY ./package.json .

RUN yarn --prod