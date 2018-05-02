FROM node:carbon

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet --production

COPY . .