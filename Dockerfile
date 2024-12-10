FROM node:20.10-buster-slim

COPY . .

RUN npm install --production

RUN npm run build

ENTRYPOINT ["node", "/dist/index.js"]