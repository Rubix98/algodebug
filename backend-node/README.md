# Somewhat minimalistic backend in node.js

REST API in `Express.js` with `MongoDB` integration  
written in `typescript`

## Compatibility with frontend

Apart from changing relevant endpoints from POST to GET this backend works similarly to the Java backend.  
If you wish to restore previous functionallity (which I consider bug/oversight) change the endpoints back to POST in `src/app.ts`

## Installing

Obviously requires node.js: <https://nodejs.org>

Then install dependencies with `npm install`

## Running

Before running the app you will need to create `.env` file in this directory and define env variables:  
`PORT` - what port to use to set http server  
`DATABASE_URI` - URI to your MongoDB service  
`DATABASE_NAME` - name of the project database  
`ORIGINS` - origins to allow cross-origin requests separated by commas  

Example `.env` file might look like this:

```env
PORT=8080
DATABASE_URI=mongodb://localhost:27017
DATABASE_NAME=AlgoDebug
ORIGINS=http://127.0.0.1:8081, https://my-service.com
```

then you have two options:

- Install typescript with `npm install -d` and then you can use `npm run dev`
OR
- Run compiled javascript code with `npm start`

### Project Overview

All files not listed bellow are either config files or dependencies related files which you should not worry about

- `src` - source code
  - `models` - schema for database (mongo bson document templates)
  - `structures` - smaller classes which compose models
  - `app.ts` - main file with all API endpoints and middleware
  - `dbservice.ts` - implements connection to database
- `dist` - compiled javascript code
- `global.d.ts` - global interface adding hinting for env variables
