all: build deploy

deploy:
	./heroku-deploy.sh

build: build-devel
	./build-docker.sh

build-devel:
	ng build

# run the development build
run-devel:
	ng serve --open

