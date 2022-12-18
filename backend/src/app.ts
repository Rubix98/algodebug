import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import { InitializeConnection } from "./services/dbservice";
import { getProjectById, getAllProjects, saveProject, updateProject } from "./endpoints/project";
import { getAllConverters, getConverterById, saveConverter, updateConverter } from "./endpoints/converter";
import { compileCode } from "./endpoints/compiler";
import { CompilerTypes } from "./services/compilers/compilerFactory";

import passport from "passport";
import session from "express-session";
import {initializePassport} from "./services/authservice.js"

interface ResponseError extends Error {
    status?: number;
}

// test env variables
dotenv.config();
["PORT", "ORIGINS", "DATABASE_URI", "DATABASE_NAME", "COMPILER", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"].forEach((variable) => {
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

// initialize database connection
await InitializeConnection();

// initialize express app
const app = express();

initializePassport();
app.use(session({secret: process.env.ALGO_SECRET as string, resave: true, saveUninitialized: true})); // tutaj w opcjach można konfigurować tą sesję (chociażby czas żywotności ciasteczka)
app.use(passport.initialize());
app.use(passport.session());

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
app.use(cors({ origin: (process.env.ORIGINS as string).split(","), credentials: true, }));

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
    console.log(req.isAuthenticated())
    req.isAuthenticated() ? next() : res.sendStatus(403);
}

// project
app.get("/project/findAll", isLoggedIn, getAllProjects); // dla celów testowych dodałem dla tego endpointu weryfikację, czy użytkownik jest zalogowany czy nie, jeżeli nie jest to wyrzuca 403
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

// passport
app.get("/auth/google", 
    passport.authenticate('google', {scope: ['email', 'profile']})
);

app.get("/auth/google/callback", 
    passport.authenticate('google', {
        successRedirect: "/auth/success",
        failureRedirect: "/error",
    })
);

app.get("/auth/success", (_req: Request, res: Response) => {
    // ten endpoint ma za zadanie wysłać wiadomość do openera (głównego okna AlgoDebug), dzięki czemu poinformujemy aplikację o poprawnej autoryzacji oraz zamknąć okno z autoryzacją.
    res.setHeader("Content-Type", "text/html");
    res.send('<script>window.onload = () => {if (!window.opener) return; window.opener.postMessage("auth success", "http://localhost:8081"); window.close()}</script>');
})

app.get("/logout", (req: Request, res: Response) => {
    req.logout(() => {
        res.status(200).json({loggedIn: false});
    });
})

app.get("/auth/verify",  (req: Request, res: Response) => {
    res.status(200).json({loggedIn: req.isAuthenticated()})
})

