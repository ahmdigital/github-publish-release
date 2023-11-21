FROM node:19

WORKDIR /root/app

RUN npm i -g npm@latest
COPY package.json package-lock.json ./
RUN npm ci --quiet --no-optional && npm cache clean --force

COPY .eslintrc jest.config.js tsconfig.json ./
COPY src ./src
COPY test ./test
