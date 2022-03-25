# this must berun within the context of the directory containing the Dockerfile.
heroku container:login
# 'web' is the process type
# 'monopoly-banker-backend' is the name of the heroku application
#heroku container:push web --app monopoly-banker-backend
#heroku container:release web --app monopoly-banker-backend
#heroku ps:scale web=1 --app monopoly-banker-backend
docker tag monopoly-backend registry.heroku.com/monopoly-banker-backend/web
docker push registry.heroku.com/monopoly-banker-backend/web
heroku container:release web --app monopoly-banker-backend
heroku ps:scale web=1 --app monopoly-banker-backend
