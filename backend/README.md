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

## Environmental variables

`PORT` - what port to use to set up http server  
`ORIGINS` - origins to allow cross-origin requests separated by commas (in node 17+ use 127.0.0.1 instead of localhost)  
`DATABASE_URI` - URI to your MongoDB service  
`DATABASE_NAME` - name of the application database  
`COMPILER` - id of chosen compiler's API. Possible values: ALGODEBUG (default), CODEX, JDOODLE  
`COMPILER_CLIENT_ID` - your client id to compiler's API (required for: JDOODLE)  
`COMPILER_CLIENT_SECRET` - your client secret to compiler's API (required for: JDOODLE)  
`COMPILER_API_URL` - alternative url to compiler's API (only for AlgoDebug compiler)

If you want to change these values locally, you can override them in `.env.local` file. Especially you can set your database connection or your secret data in `.env.local` file.

## Running

You have two options:

-   You can run this with `npm run dev` which will use `ts-node` to autocompile and run  
    OR
-   Compile to javascript yourself with `npm run build` and then you can use `npm start`  
    (note: you will need to recompile after introducing changes)

### Testing

Validators can be tested with `npm test`  
This should cover most common API request mistakes.  
(note: this checks only validators not whole API so invalid JSONs, invalid request endpoints and database operations are not tested)
