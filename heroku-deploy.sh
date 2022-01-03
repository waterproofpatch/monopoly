heroku container:login
heroku container:push web --app monopoly-banker
heroku container:release web --app monopoly-banker
heroku ps:scale web=1 --app monopoly-banker