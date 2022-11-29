import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import { InitializeConnection } from "./services/dbservice";
import {
    getProjectById,
    getAllProjects,
    saveProject,
    updateProject,
} from "./endpoints/project";
import {
    getAllConverters,
    getConverterById,
    saveConverter,
    updateConverter,
} from "./endpoints/converter";
import { compileCode } from "./endpoints/compiler";

interface ResponseError extends Error {
    status?: number;
}

// test env variables
dotenv.config();
["PORT", "ORIGINS", "DATABASE_URI", "DATABASE_NAME", "COMPILER_URL"].forEach(
    (variable) => {
        if (!process.env[variable]) {
            throw new Error(`Environment variable ${variable} is not set`);
        }
    }
);

// initialize database connection
await InitializeConnection();

// initialize express app
const app = express();

/* Middleware */

app.listen(process.env.PORT, () => {
    console.log(`Server is running on: http://localhost:${process.env.PORT}`);
});

// attach application/json header to all responses
app.use((_req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

// allow cross-origin requests for all origins defined in .env
app.use(cors({ origin: (process.env.ORIGINS as string).split(",") }));

// parse request body as JSON
app.use(express.json());

// catch invalid JSONs
app.use(
    (err: ResponseError, _req: Request, res: Response, next: NextFunction) => {
        if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
            return res.status(400).send({ error: err.message });
        }
        next();
    }
);

/* API endpoints */

// project
app.get("/project/findAll", getAllProjects);
app.get("/project/find/:id", getProjectById);
app.post("/project/save", saveProject);
app.put("/project/save", updateProject);

// converter
app.get("/converter/findAll", getAllConverters);
app.get("/converter/find/:id", getConverterById);
app.post("/converter/save", saveConverter);
app.put("/converter/save", updateConverter);

// compiler
app.post("/compiler/compile", compileCode);
