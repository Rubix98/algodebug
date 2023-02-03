declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string;
        ORIGINS: string;
        DATABASE_URI: string;
        DATABASE_NAME: string;
        BACKEND_URL: string;

        COMPILER: string;
        COMPILER_CLIENT_ID: string;
        CIMPILER_CLIENT_SECRET: string;

        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        ALGO_SECRET: string;
    }
}
