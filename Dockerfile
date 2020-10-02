FROM node:alpine
LABEL org.opencontainers.image.source https://github.com/hepiska/kelak-be

WORKDIR /usr/src/be

COPY . /usr/src/be

RUN npm install

RUN npm run build



CMD ["node", "server.js"]
