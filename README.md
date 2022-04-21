# Monopoly Banker

This web service helps players of the classic board game monopoly keep track of 
money digitally, without the use of paper money.

The application is hosted on <http://monopoly-banker.herokuapp.com/home>. Don't use important email/passwords when registering, since the application isn't using TLS other than what is provided by heroku.

## Tech Stack

This application uses:

* Angular
  * for the frontend
* golang
  * for the backend
* docker
  * for deployment
* docker-compose
  * for hosting the backend in development

## Development

To start the frontend in development mode:

```bash
cd frontend
make run-devel
```

To start the backend in development mode:

```bash
cd backend
docker-compose up --build
```


## Deployment

This repo is set up to deploy to heroku. 

You'll have to make changes to point to your heroku instance in the `backend/heroku-deploy.sh` and `frontend/heroku-deploy.sh` scripts.

```bash
cd frontend && make deploy
cd backend && make deploy
```