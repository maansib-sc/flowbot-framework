FROM node:18

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn

COPY . .

ENV PORT 80
