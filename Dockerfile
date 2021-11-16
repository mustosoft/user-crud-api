FROM node:latest
WORKDIR /app

COPY package*.json ./
COPY src/ src/
COPY index.js .
COPY start.sh .

RUN npm install
EXPOSE 3000

CMD ["/bin/sh", "start.sh"]
