FROM node

WORKDIR /build/server
COPY server/package.json /build/server
RUN npm i
COPY ./server /build/server

EXPOSE 3003

CMD ["npm", "run", "dev"]