FROM node:16

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

ARG BOT_TOKEN
ENV BOT_TOKEN ${BOT_TOKEN}

CMD [ "node", "index.js" ]
