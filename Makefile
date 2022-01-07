all: build deploy

build:
	ng build
	./build-docker.sh

deploy:
	./heroku-deploy.sh

