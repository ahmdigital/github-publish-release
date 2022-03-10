FROM node:16

WORKDIR /root/app

RUN npm i -g npm@latest
COPY package.json package-lock.json ./
RUN npm ci --quiet --no-optional && npm cache clean --force

COPY .eslintrc ./
COPY src ./src
COPY jest.config.js ./
COPY tsconfig.json ./
COPY test ./test

COPY .git ./.git

