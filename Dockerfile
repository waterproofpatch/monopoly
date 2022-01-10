### STAGE 1: Build ###
FROM node:alpine AS build
WORKDIR /usr/src/app
ENV NODE_OPTIONS=--openssl-legacy-provider
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/monopoly /usr/share/nginx/html

# Heroku sets $PORT at runtime, and we need to replace that string in the nginx conf before starting nginx
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf && nginx -g 'daemon off;'