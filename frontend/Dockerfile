# # Stage 1: Build
# FROM node:16 as build
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm ci
# COPY . ./
# RUN npm run build

# # Stage 2: Serve
# FROM nginx:1.17.1-alpine
# COPY --from=build /app/dist/digital-vaccine-booking-system/ /usr/share/nginx/html
# COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

# # Stage 2: Serve
# FROM nginx:1.17.1-alpine
# COPY --from=build /app/dist/digital-vaccine-booking-system/ /usr/share/nginx/html
# COPY --from=build /app/src/assets/config.json /usr/share/nginx/html/assets/
# COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

# Stage 1: Build
FROM node:16 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Stage 2: Serve
FROM nginx:1.17.1-alpine
COPY --from=build /app/dist/digital-vaccine-booking-system/ /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

CMD ["/docker-entrypoint.sh"]



