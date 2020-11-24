FROM node:12

WORKDIR /app

COPY package*.json ./
RUN npm install --quiet

COPY . .

VOLUME /app
EXPOSE 3000
CMD ["npm", "run", "dev"]
