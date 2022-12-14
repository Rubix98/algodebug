# AlgoDebug

Algodebug is a tool for debugging source code provided by user by visualizing its operation. This is a tool designed primarily for people working with algorithmics or students. 

Current version of application: http://srv16.mikr.us:20232 (work in progress)

## Frontend

To run frontend:  
`cd frontend && npm install`  
then  
`npm run serve` 

More information about frontend [here](frontend/README.md).  

## Backend

To run backend:  
`cd backend && npm install -d`  
then  
`npm run dev`

More information about backend [here](backend/README.md).  

### Running application with docker

If you want you can run application (frontend + backend) with docker-compose (it is recommended only for production) using this command:

`docker-compose up -d --build`
