# Combined single-container build: React (built) + Express, served from one
# process on one port. Used for simple free-tier hosts (e.g. Render) that run
# a single web service per app. Local development still uses docker-compose.yml
# (separate nginx + server containers) - this file does not replace that.

FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install --omit=dev
COPY server/ ./
COPY --from=client-build /app/client/dist ./public

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "src/app.js"]
