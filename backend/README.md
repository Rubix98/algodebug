# Somewhat minimalistic backend in node.js / typescript

REST API in `Express.js` with `MongoDB` integration  
written in `typescript`

Since javascript is dynamically typed this backend uses [runtypes](https://www.npmjs.com/package/runtypes) for runtime validation.  
Invalid POST requests return RuntypeError which contains informaion why request body was not valid.

## Installing

Obviously requires node.js: <https://nodejs.org> >= 18  
(which is needed for frontend anyways)

After consideraton I decided to remove compiled javascript from this repository and as such you should always install this with dev dependencies using:  
`npm install -d`

As for database you can connect to `MongoDB Atlas` using URI like in [example below](./README.md#L37)

Alternatively you can use local database for development - `MongoDB Community Server`:  
<https://www.mongodb.com/try/download/community>  
Then URI will look something like this: `mongodb://127.0.0.1:27017`

In any case you might be intrested in using `MongoDB Compass` to explore the database:
<https://www.mongodb.com/try/download/compass>

## Running

Before running the app you will need to create `.env` file in this directory and define env variables:  
`PORT` - what port to use to set up http server  
`DATABASE_URI` - URI to your MongoDB service  
`DATABASE_NAME` - name of the application database  
`ORIGINS` - origins to allow cross-origin requests separated by commas  
`COMPILER_URL` - URL to compiler API

(in node 17+ use 127.0.0.1 instead of localhost)

Example `.env` file might look like this:

```env
PORT=8080
DATABASE_URI=mongodb+srv://AlgoDebug:AlgoDebug@streamchess.jlv3n.mongodb.net/
DATABASE_NAME=AlgoDebug
ORIGINS=http://127.0.0.1:8081,http://localhost:8081,https://my-service.com
COMPILER_URL=https://codex-api.herokuapp.com/
```

then you have two options:

-   You can run this with `npm run dev` which will use `ts-node` to autocompile and run  
    OR
-   Compile to javascript yourself with `npm run build` and then you can use `npm start`  
    (note: you will need to recompile after introducing changes)

### Testing

Validators can be tested with `npm test`  
This should cover most common API request mistakes.  
(note: this checks only validators not whole API so invalid JSONs, invalid request endpoints and database operations are not tested)

### Project Overview

-   `src` - source code
    -   `endpoints` - implement endpoints logic
    -   `models` - schema for database (mongo bson document templates)
    -   `structures` - smaller classes which compose models
    -   `services` - logic that is not directly related to API
    -   `app.ts` - main file with all API endpoints and middleware
    -   `types` - typescript type declaration files (.d.ts)
-   `tests` - Jest unit tests
    -   `validation.test.ts` - tests API validation functions (not API itself)
