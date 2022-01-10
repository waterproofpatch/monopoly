FROM golang:alpine AS build

RUN apk --no-cache add gcc g++ make git

WORKDIR /go/src/app

# add go src code
COPY . .

# build go src code
RUN go get
RUN GOOS=linux go build -ldflags="-s -w" -v -o ./bin/web-app 

FROM alpine:3.13
RUN apk --no-cache add ca-certificates

# add golang project
WORKDIR /usr/bin
COPY --from=build /go/src/app/bin /go/bin

# certs
RUN mkdir -p /go/bin/certs
COPY certs/cert.pem /go/bin/certs/cert.pem
COPY certs/key.pem /go/bin/certs/key.pem

WORKDIR /go/bin
ENTRYPOINT /go/bin/web-app --port 8081
