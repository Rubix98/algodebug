# AlgoDebug

AlgoDebug is a tool designed for debugging user provided source code through visualization of its operations. It was created primarily for people working with algorithmics and computer science students.

Current version of application: <https://algodebug.pl> (work in progress)

AlgoDebug compiler repository: <https://github.com/Rubix98/algodebug_compiler>

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

If you want, you can run application (frontend + backend) with docker-compose (it is recommended only for production) using this command:

`docker-compose up -d --build`
