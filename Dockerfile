FROM node:16-alpine

ENV NODE_ENV production

WORKDIR /user/src/app

COPY --chown=node:node . /user/src/app

USER node

EXPOSE 8080

CMD ["./node_modules/.bin/babel-node", "--experimental-specifier-resolution=node", "./server"]
