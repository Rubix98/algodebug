declare namespace NodeJS {
    export interface ProcessEnv {
        // from .env
        DATABASE_URI: string;
        DATABASE_NAME: string;

        COMPILER: string;
        COMPILER_CLIENT_ID: string;
        CIMPILER_CLIENT_SECRET: string;

        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        ALGO_SECRET: string;

        // from ../.env
        BACKEND_URL: string;
        FRONTEND_URL: string;
        FRONTEND_PORT: string;
        BACKEND_PORT: string;
        ORIGINS: string;
    }
}
