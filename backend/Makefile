all: build deploy

deploy:
	./heroku-deploy.sh

build: build-devel
	./build-docker.sh

build-devel:
	(cd src && go build .)

start-db:
	docker run -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

# run the development build
run-devel:
	(cd src && PORT=5001 DATABASE_URL=postgres://postgres:docker@localhost:5432/postgres go run .)

# Generate SSL certificates for the backend.
certs:
	openssl req  -nodes -new -x509  -keyout $(BACKEND_SRC_DIR)/certs/key.pem -out $(BACKEND_SRC_DIR)/certs/cert.pem
