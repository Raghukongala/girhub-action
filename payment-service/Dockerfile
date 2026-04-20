FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .
EXPOSE 3004
CMD ["node", "src/server.js"]
