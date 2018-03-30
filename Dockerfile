FROM node:carbon-alpine
LABEL maintainer="https://github.com/bufferoverflow/verdaccio-gitlab"

RUN apk --no-cache add openssl && \
    wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 && \
    chmod +x /usr/local/bin/dumb-init && \
    apk del openssl
    
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++
        
ENV APPDIR /usr/local/app

WORKDIR $APPDIR

ADD . $APPDIR

ENV NODE_ENV=production

RUN npm config set registry http://registry.npmjs.org/ && \
    npm install -g verdaccio@2.7.3 && \
    npm install -g verdaccio-gitlab@latest && \
    apk del .gyp

RUN mkdir -p /verdaccio/storage /verdaccio/conf

ADD docker-verdaccio-gitlab.config.yaml /verdaccio/conf/config.yaml

RUN chmod -R 777 /verdaccio/storage /verdaccio/conf

RUN addgroup -S verdaccio && adduser -S -G verdaccio verdaccio && \
    chown -R verdaccio:verdaccio "$APPDIR" && \
    chown -R verdaccio:verdaccio /verdaccio

USER verdaccio

ENV PORT 4873
ENV PROTOCOL http

EXPOSE $PORT

VOLUME ["/verdaccio"]

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]

CMD verdaccio --config /verdaccio/conf/config.yaml --listen $PROTOCOL://0.0.0.0:${PORT}
