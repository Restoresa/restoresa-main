FROM node:20-alpine3.17 as build

COPY . .

RUN npm ci && \
    npm run build 

FROM alpine:3.18.2

RUN apk add nginx

COPY --from=build ./build /usr/share/nginx/html

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./ssl/ /etc/nginx/

EXPOSE 443

EXPOSE 80

CMD nginx -g "daemon off;"