import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import * as dotenv from "dotenv";

import { getProjectById, getAllProjects, saveProject, updateProject } from "./project/endpoints";
import { getAllConverters, getConverterById, saveConverter, updateConverter } from "./converter/endpoints";
import { compileCode } from "./compiler/endpoints";
import { CompilerTypes } from "./compiler/compilers/compilerFactory";
import { Collection, MongoClient } from "mongodb";
import { Project } from "./project/model";
import { Converter } from "./converter/model";
import { User } from "./user/model";
import { initializePassport } from "./user/service";

let projectCollection: Collection<Project>;
let converterCollection: Collection<Converter>;
let userCollection: Collection<User>;

export const getCollections = () => {
    return {
        projects: projectCollection,
        converters: converterCollection,
        users: userCollection,
    };
};

interface ResponseError extends Error {
    status?: number;
}

// test env variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

["PORT", "ORIGINS", "DATABASE_URI", "DATABASE_NAME", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "ALGO_SECRET"].forEach(
    (variable) => {
        if (!process.env[variable]) {
            throw new Error(`Environment variable ${variable} is not set`);
        }
    }
);

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
try {
    const client = new MongoClient(process.env.DATABASE_URI as string);
    await client.connect();
    const database = client.db(process.env.DATABASE_NAME);

    projectCollection = database.collection<Project>("projects");
    converterCollection = database.collection<Converter>("converters");

    // unique constraint on provider and user id from provider
    userCollection = database.collection<User>("users");
    await userCollection.createIndex({ provider: 1, id: 1 }, { unique: true });

    console.log("Successfully connected to database");
} catch (error) {
    console.log("Error while connecting to database:");
    throw error;
}

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

// passport
app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: "/auth/success",
        failureRedirect: "/error",
    })
);

app.get("/auth/success", (req: Request, res: Response) => {
    // ten endpoint ma za zadanie wysłać wiadomość do openera (głównego okna AlgoDebug), dzięki czemu poinformujemy aplikację o poprawnej autoryzacji oraz zamknąć okno z autoryzacją.
    res.setHeader("Content-Type", "text/html");
    const user = JSON.stringify(req.user);
    res.send(
        `<script>window.onload = () => {if (!window.opener) return; window.opener.postMessage(${user}, "http://localhost:8081"); window.close()}</script>`
    );
});

app.get("/logout", (req: Request, res: Response) => {
    req.logout(() => {
        res.status(200).json({ loggedIn: false });
    });
});

app.get("/auth/verify", (req: Request, res: Response) => {
    res.status(200).json({ loggedIn: req.isAuthenticated() });
});
