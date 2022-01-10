# Directories

all: build deploy

deploy:
	echo "Not implemented yet!"

build:
	go build
	./build-docker.sh

# run the development build
run-devel:
	PORT=8082 CERTS_PATH=`pwd`/$(BACKEND_SRC_PATH)/certs/ go run *.go 

run-docker: 
	docker run -e PORT=8082 -p 8082:8082 monopoly-backend 

# Generate SSL certificates for the backend.
certs:
	openssl req  -nodes -new -x509  -keyout $(BACKEND_SRC_DIR)/certs/key.pem -out $(BACKEND_SRC_DIR)/certs/cert.pem
