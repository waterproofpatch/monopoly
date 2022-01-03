FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY /dist/monopoly /usr/share/nginx/html

# Heroku sets $PORT at runtime, and we need to replace that string in the nginx conf before starting nginx
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf && nginx -g 'daemon off;'