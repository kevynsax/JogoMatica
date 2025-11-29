FROM node:22 AS build
WORKDIR /app
COPY . .

ENV PUBLIC_URL=/jogomatica
RUN npm install --silent
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build/ /usr/share/nginx/html/jogomatica/
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
