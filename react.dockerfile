FROM node

WORKDIR /build/website
COPY website/package.json /build/website
RUN npm i
COPY ./website /build/website

CMD ["npm", "start"]