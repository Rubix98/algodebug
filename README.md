# AlgoDebug

For working version check `stable` branch

Apart from dependency bump and general error prevention (not bug fixing) in frontend most of this fork focuses on implementation of node-backend 

Since there is no option to add issues on forks I created project under projects tab where I will be adding issues/feature requests

## Frontend

`cd frontend && npm install`  
then  
`npm run serve`

## Backend

Local MongoDB database - mongo community server:  
<https://www.mongodb.com/try/download/community>

some test data can be imported from `backend/database-import`

To use (original) Java backend  
`cd backend && ./mvnw spring-boot:run`  
OR  
`cd backend-node && npm install -d && npm run dev`  
To use (alternative) node.js backend  
