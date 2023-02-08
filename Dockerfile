FROM node

WORKDIR /build/client
COPY client/package.json /build/client
RUN npm i
COPY ./client /build/client

CMD ["npm", "start"]