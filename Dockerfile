FROM node:18.19.0
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --ignore-scripts

RUN addgroup --system nonroot && adduser --system --group nonroot
USER nonroot

COPY ./dist /usr/src/app/dist
COPY ./swagger-output.json /usr/src/app/swagger-output.json

EXPOSE 4000

CMD [ "node", "./dist/index.js" ]