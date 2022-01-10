all: build deploy

deploy:
	./heroku-deploy.sh

build:
	ng build
	./build-docker.sh

# run the development build
run-devel:
	ng serve --open

run-docker:
	echo "Not implemented yet!"
