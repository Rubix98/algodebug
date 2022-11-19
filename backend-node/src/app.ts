import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

import { InitializeConnection, validateConverter, validateProject } from './dbservice';

interface ResponseError extends Error {
    status?: number;
}

// test env variables
dotenv.config();
["PORT", "ORIGINS", "DATABASE_URI", "DATABASE_NAME"].forEach((variable) => {
    if (!process.env[variable]) {
        throw new Error(`Environment variable ${variable} is not set`);
    }
});

// initialize database connection
const { projects, converters } = await InitializeConnection();

// initialize express app
const app = express();

/* Middleware */

app.listen(process.env.PORT, () => {
    console.log(`Server is running on: http://localhost:${process.env.PORT}`);
});

// attach application/json header to all responses
app.use((_req, res, next) => { res.setHeader('Content-Type', 'application/json'); next(); });

// allow cross-origin requests for all origins defined in .env
app.use(cors({origin: (process.env.ORIGINS as string).split(",")}));

// parse request body as JSON
app.use(express.json());

// catch invalid JSONs
app.use((err: ResponseError, _req: Request, res: Response, next: NextFunction ) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ error: err.message });
    }
    next();
});

/* API endpoints */

// GET all projects
app.get('/project/findAll', async (_req, res) => {
    try {
        const result = await projects.find({}).toArray();

        if (!result || result.length === 0) {
            res.status(204).send();
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// GET project by id
app.get('/project/find/:id', async (req, res) => {
    try { 
        const id = new ObjectId(req.params.id);

        try {
            const result = await projects.findOne({ _id: id });
    
            if (!result) {
                res.status(404).json({ error: 'No project found with given id' });
                return;
            }
            else {
                res.status(200).json(result);
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    } 
    catch {
        res.status(400).json({ error: 'Invalid id' });
    }
});

// POST new project
app.post('/project/save', async (req, res) => {
    const [isOk, data] = validateProject(req.body);

    if (!isOk) {
        res.status(400).json({ error: 'Invalid request body: ' + data});
        return;
    }
    
    try {
        const result = await projects.insertOne(data);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// GET all converters
app.get('/converter/findAll', async (_req, res) => {
    try {
        const result = await converters.find({}).toArray();

        if (!result || result.length === 0) {
            res.status(204).send();
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// GET converter by id
app.get('/converter/find/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);

        try {
            const result = await converters.findOne({ _id: id });
    
            if (!result) {
                res.status(404).json({ error: 'No converter found with given id' });
            }
            else {
                res.status(200).json(result);
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    catch {
        res.status(400).json({ error: 'Invalid id' });
    }
});

// POST new converter
app.post('/converter/save', async (req, res) => {
    const [isOk, data] = validateConverter(req.body);

    if (!isOk) {
        res.status(400).send({ error: 'Invalid request body: ' + data });
        return;
    }

    try {
        const result = await converters.insertOne(data);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
