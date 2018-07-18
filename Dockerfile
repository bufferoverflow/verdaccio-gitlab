FROM node:10.3-alpine
LABEL maintainer="https://github.com/bufferoverflow/verdaccio-gitlab"

RUN apk --no-cache add openssl curl && \
    curl -sL -o /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 && \
    chmod +x /usr/local/bin/dumb-init && \
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

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]

CMD $APPDIR/node_modules/.bin/verdaccio --config /verdaccio/conf/config.yaml --listen $PROTOCOL://0.0.0.0:${PORT}
