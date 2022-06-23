FROM node:14
WORKDIR /
COPY package.json .
COPY /config/config.json /config/config.json
RUN npm install -g sequelize-cli
RUN npm install
RUN sequelize db:migrate
COPY . .
CMD npm start