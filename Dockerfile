FROM node:20.10-buster-slim

COPY . .

RUN npm install --production

ENTRYPOINT ["node", "/dist/index.js"]