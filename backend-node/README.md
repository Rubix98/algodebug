# Somewhat minimalistic backend in node.js / typescript

REST API in `Express.js` with `MongoDB` integration  
written in `typescript`

## Compatibility with frontend

This backend aims to work similarly to Java backend and unless specified will produce same results.

## Installing

Obviously requires node.js: <https://nodejs.org>  
(which is needed for frontend anyways)

After consideraton I decided to remove compiled javascript from this repository and us such you should always install this with dev dependencies using:  
`npm install -d`

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
ORIGINS=http://127.0.0.1:8081,https://my-service.com
```

then you have two options:

- You can run this with `npm run dev` which  will use `ts-node` to autocompile and run
OR
- Compile to javascript yourself with `npm run build` and then you can use `npm start`  
(note: you will need to recompile after introducing changes)

### Project Overview

All files not listed below are either config files or dependencies related files which you should not worry about

- `src` - source code
  - `models` - schema for database (mongo bson document templates)
  - `structures` - smaller classes which compose models
  - `app.ts` - main file with all API endpoints and middleware
  - `dbservice.ts` - implements connection to database
- `global.d.ts` - global interface adding hinting for env variables
