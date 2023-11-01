FROM node:20-alpine3.17 as build

COPY . .

RUN npm ci && \
    npm run build 

FROM alpine:3.18.2

RUN apk add nginx && \
    apk update && \
    apk add --no-cache openssl && \
    openssl req -x509 -newkey rsa:4096 -keyout /etc/nginx/cert.key -out /etc/nginx/cert.crt -sha256 -days 3650 -nodes -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"

COPY --from=build ./build /usr/share/nginx/html

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 443

EXPOSE 80

CMD nginx -g "daemon off;"