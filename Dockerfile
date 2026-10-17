FROM node:22-slim AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run lint && npm run build

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js

EXPOSE 8080
CMD ["node", "server.js"]
