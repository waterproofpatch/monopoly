# Directories

all: docker-backend

# Build the backend docker image.
docker-backend: 
	docker build -t monopoly-backend . 

run-backend:
	CERTS_PATH=`pwd`/$(BACKEND_SRC_PATH)/certs/ go run *.go --port 8081

# Generate SSL certificates for the backend.
certs:
	openssl req  -nodes -new -x509  -keyout $(BACKEND_SRC_DIR)/certs/key.pem -out $(BACKEND_SRC_DIR)/certs/cert.pem
