FROM node:10-alpine
LABEL maintainer="https://github.com/bufferoverflow/verdaccio-gitlab"

RUN apk --no-cache add wget openssl dumb-init && \
    apk del openssl

ENV APPDIR /usr/local/app

WORKDIR $APPDIR

ADD . $APPDIR

ENV NODE_ENV=production

RUN npm config set registry https://registry.npmjs.org/ && \
    yarn install --production=false && \
    yarn build && \
    yarn cache clean && \
    yarn install --production=true --pure-lockfile && \
    yarn add file:.

RUN mkdir -p /verdaccio/storage /verdaccio/conf

ADD docker-verdaccio-gitlab.config.yaml /verdaccio/conf/config.yaml

RUN addgroup -S verdaccio && adduser -S -G verdaccio verdaccio && \
    chown -R verdaccio:verdaccio "$APPDIR" && \
    chown -R verdaccio:verdaccio /verdaccio

USER verdaccio

ENV PORT 4873
ENV PROTOCOL http

EXPOSE $PORT

VOLUME ["/verdaccio"]

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD $APPDIR/node_modules/.bin/verdaccio --config /verdaccio/conf/config.yaml --listen $PROTOCOL://0.0.0.0:${PORT}
