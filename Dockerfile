FROM node:12.16.2 as build
WORKDIR /app
COPY . .
RUN npm install --silent
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build/ /usr/share/nginx/html/
EXPOSE 80