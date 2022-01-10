heroku container:login
heroku container:push web --app monopoly-banker-backend
heroku container:release web --app monopoly-banker-backend
heroku ps:scale web=1 --app monopoly-banker-backend
