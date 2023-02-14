FROM node

WORKDIR /build/server
COPY server/package.json /build/server
RUN npm i
COPY ./server /build/server

WORKDIR /build/website
COPY website/package.json /build/website/
RUN npm i
COPY ./website /build/website

EXPOSE 3001

CMD ["npm", "run", "dev", "npm", "start"]