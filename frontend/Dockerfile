FROM node:18
RUN npm install -g @vue/cli

WORKDIR /app/
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE ${PORT}
CMD ["npm", "run", "serve"]
