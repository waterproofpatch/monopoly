# Directories

all: build deploy

deploy:
	echo "Not implemented yet!"

build:
	go build
	./build-docker.sh

# run the development build
run-devel:
	CERTS_PATH=`pwd`/$(BACKEND_SRC_PATH)/certs/ go run *.go --port 8081

run-docker: 
	docker run monopoly-backend -p 8081:8081 

# Generate SSL certificates for the backend.
certs:
	openssl req  -nodes -new -x509  -keyout $(BACKEND_SRC_DIR)/certs/key.pem -out $(BACKEND_SRC_DIR)/certs/cert.pem
