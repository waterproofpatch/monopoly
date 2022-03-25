deploy: build-docker
	./heroku-deploy.sh

build-docker:
	./build-docker.sh

build-local:
	(cd src && go build .)

run-devel: build-docker
	docker-compose up --build
