declare namespace NodeJS {
    export interface ProcessEnv {
        DATABASE_URI: string;
        DATABASE_NAME: string;
        PORT: string;
        ORIGINS: string;
        COMPILER: string;
        COMPILER_CLIENT_ID: string;
        CIMPILER_CLIENT_SECRET: string;
    }
}
