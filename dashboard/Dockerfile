# build environment
FROM node:carbon as builder

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
# Override the base log level (info).
ENV NPM_CONFIG_LOGLEVEL warn

# Install all dependencies of the current project.
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

# Copy all local files into the image.
COPY . .

# Build for production.
RUN yarn run build --production

# production environment
FROM nginx:1.13.9-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]