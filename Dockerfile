FROM node:alpine

WORKDIR /usr/src/be

COPY . /usr/src/be

RUN npm install

RUN npm run build



CMD ["node", "server.js"]
