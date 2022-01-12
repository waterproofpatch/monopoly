all: build deploy

deploy:
	./heroku-deploy.sh

build: build-devel
	./build-docker.sh

build-devel:
	go build

# run the development build
run-devel:
	PORT=5001 DB_HOST=localhost DB_USER=postgres DB_PASSWORD=docker DB_PORT=5432 DB_NAME=postgres CERTS_PATH=`pwd`/$(BACKEND_SRC_PATH)/certs/ go run *.go

# Generate SSL certificates for the backend.
certs:
	openssl req  -nodes -new -x509  -keyout $(BACKEND_SRC_DIR)/certs/key.pem -out $(BACKEND_SRC_DIR)/certs/cert.pem
