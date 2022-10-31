declare namespace NodeJS {
    export interface ProcessEnv {
        DATABASE_URI: string,
        DATABASE_NAME: string,
        PORT: string,
        ORIGINS: string
    }
}
