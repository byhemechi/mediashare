FROM node
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

EXPOSE 80
CMD [ "node", "build/index.js" ]
