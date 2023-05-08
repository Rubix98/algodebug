import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import * as dotenv from "dotenv";

import { getProjectById, getAllProjects, saveProject, updateProject, deleteProject } from "./project/endpoints";
import { getAllConverters, getConverterById, saveConverter, updateConverter } from "./converter/endpoints";
import { compileCode } from "./compiler/endpoints";
import { CompilerTypes } from "./compiler/compilers/compilerFactory";
import { initializePassport } from "./user/service";
import { authCallback, authLogout, authSuccess, authUser, authVerify, updateUsername } from "./user/endpoints";
import { initializeDatabase } from "./db";
interface ResponseError extends Error {
    status?: number;
}

// test env variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

[
    "PORT",
    "ORIGINS",
    "DATABASE_URI",
    "DATABASE_NAME",
    "BACKEND_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "ALGO_SECRET",
].forEach((variable) => {
    if (!process.env[variable]) {
        throw new Error(`Environment variable ${variable} is not set`);
    }
});

if (process.env.COMPILER && !Object.keys(CompilerTypes).includes(process.env.COMPILER)) {
    throw new Error(
        `Environment variable COMPILER should be set to one of the following values: ${Object.keys(CompilerTypes)}`
    );
}

if (process.env.COMPILER == CompilerTypes.JDOODLE) {
    ["COMPILER_CLIENT_ID", "COMPILER_CLIENT_SECRET"].forEach((variable) => {
        if (!process.env[variable]) {
            throw new Error(`Environment variable ${variable} is not set`);
        }
    });
}

await initializeDatabase();

// initialize express app
const app = express();

// initialize passport
initializePassport();
// tutaj w opcjach można konfigurować tą sesję (chociażby czas żywotności ciasteczka)
app.use(session({ secret: process.env.ALGO_SECRET as string, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

/* Middleware */

app.listen(process.env.PORT, () => {
    console.log(`Backend server is running on port: ${process.env.PORT}`);
});

// attach application/json header to all responses
app.use((_req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

// allow cross-origin requests for all origins defined in .env
app.use(cors({ origin: (process.env.ORIGINS as string).split(","), credentials: true }));

// parse request body as JSON
app.use(express.json());

// catch invalid JSONs
app.use((err: ResponseError, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).send({ error: err.message });
    }
    next();
});

/* API endpoints */
const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    req.isAuthenticated() ? next() : res.sendStatus(403);
};
// project
app.get("/project/findAll", getAllProjects);
app.get("/project/find/:id", getProjectById);
app.post("/project/save", isLoggedIn, saveProject);
app.put("/project/save", isLoggedIn, updateProject);
app.delete("/project/:id", isLoggedIn, deleteProject);

// converter
app.get("/converter/findAll", getAllConverters);
app.get("/converter/find/:id", getConverterById);
app.post("/converter/save", saveConverter);
app.put("/converter/save", updateConverter);

// compiler
app.post("/compiler/compile", compileCode);

// user
app.put("/user/username", updateUsername);

// passport
// order of these routes is important
app.get("/logout", authLogout);
app.get("/auth/success", authSuccess);
app.get("/auth/verify", authVerify);
app.get("/auth/:provider/callback", authCallback);
app.get("/auth/:provider", authUser);
app.get("/error", (_req, res) => res.send("Error while logging in"));
