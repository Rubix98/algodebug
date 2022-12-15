# AlgoDebug

## Frontend

To run frontend:  
`cd frontend && npm install`  
then  
`npm run serve`

## Backend

To connect database create `.env` file in backend directory and specify database URI.  
More information about it [here](backend/README.md#running).  

To run backend:  
`cd backend && npm install -d`  
then  
`npm run dev`

### How to connect Google Identity API

Prerequisites:
[Google Cloud Platform account](https://console.cloud.google.com)

1. Create new project
1. APIs & Services -> Credentials -> Create credentials -> OAuth client ID
1. Select Web application
1. Add autorized JavaScript origins (URL of frontend)
1. Add autorized redirect URIs (URL of backend endpoint)
1. Copy Client ID into .env file in backend directory (GOOGLE_CLIENT_ID)
1. Copy Client ID into config.json in frontend directory (google_client_id), later will be replaced with .env
1. Set ALGO_SECRET in .env file in backend directory to whatever you like (it's used to sign JWT tokens)

You can also follow [this guide](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)
