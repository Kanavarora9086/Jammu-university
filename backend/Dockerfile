FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY src ./src
COPY .env.example ./.env.example

ENV PORT=5000
EXPOSE 5000

CMD ["node", "src/server.js"]

