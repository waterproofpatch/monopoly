heroku container:login
heroku container:push monopoly --app monopoly-banker
heroku container:release monopoly --app-monopoly-banker
heroku ps:scale monopoly=1 --app monopoly-banker