#/bin/bash


docker run \
        -e PORT=5001 \
		-e DATABASE_URL=postgres://postgres:docker@localhost:5432/postgres \
        --net=host \
        -p 5001:5001 monopoly-backend 
