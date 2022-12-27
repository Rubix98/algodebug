# Frontend

Frontend is written in VueJs using VueX. Drawing graphic objects on the stage is done using the KonvaJS library (https://konvajs.org/)

## Environmental variables

`PORT` - what port to use to set up application  
`VUE_APP_BACKEND_URL` - url to backend server

If you want to change these values locally, you can override them in `.env.local` file.

## Running

-   Use `npm run serve` in development to run application. The page will reload after changing files.
    OR
-   Use `npm run build` to build application to get static files for production.

## Theme

#### Vuetify

The frontend uses the Vuetify framework which implements the Material Design theme developed by Google.
As much as possible, the project should use components from this design to keep the theme consistent.

Vuetify documentation can be found at this [link](https://next.vuetifyjs.com/en/).\
[Older documentation](https://vuetifyjs.com/en/) may also be helpful.
