FROM node:12.18-alpine

WORKDIR /app

ADD package.json /app

RUN yarn install --silent

ADD . /app

