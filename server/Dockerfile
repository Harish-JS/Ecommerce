FROM node:alpine
WORKDIR /app1
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5050
CMD ["npm", "start"]
