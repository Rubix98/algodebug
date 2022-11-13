import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

// test env variables
dotenv.config();
["PORT", "ORIGINS", "DATABASE_URI", "DATABASE_NAME"].forEach((variable) => {
    if (!process.env[variable]) {
        throw new Error(`Environment variable ${variable} is not set`);
    }
});

import { InitializeConnection, validateConverter, validateProject } from './dbservice';

// initialize database connection
const { projects, converters } = await InitializeConnection();

// initialize express app
const app = express();

/* Middleware */

// allow cross-origin requests for all origins in config
app.use(cors({origin: (process.env.ORIGINS as string).split(",")}));

// parse request body as JSON
app.use(express.json());

// attach application/json header to all responses
app.use((_req, res, next) => { res.setHeader('Content-Type', 'application/json'); next(); });

app.listen(process.env.PORT, () => {
    console.log(`Server is running on: http://localhost:${process.env.PORT}`);
});

/* API endpoints */

// GET all projects
app.get('/project/findAll', async (_req, res) => {
    try {
        const result = await projects.find({}).toArray();
        if (!result || result.length === 0) {
            res.status(204).send({ message: 'No projects found' });
            return;
        }
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});

// GET project by id
app.get('/project/find/:id', async (req, res) => {
    try {
        const result = await projects.findOne({ _id: new ObjectId(req.params.id) });
        if (!result) {
            res.status(404).send({ error: 'Project not found' });
            return;
        }
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});

// POST new project
app.post('/project/save', async (req, res) => {
    try {
        
        const [isOk, data] = validateProject(req.body);

        if (!isOk) {
            res.status(400).send({ error: 'Invalid request body: ' + data });
            return;
        }
        
        try {
            const result = await projects.insertOne(data);
            res.status(200).json(result);
        }
        catch (err) {
            res.status(500).send({ error: err });
        }
    }
    catch (err) {
        res.status(400).send({ error: 'Invalid request body: ' + err });
    }
});

// GET all converters
app.get('/converter/findAll', async (_req, res) => {
    try {
        const result = await converters.find({}).toArray();
        if (!result || result.length === 0) {
            res.status(204).send({ message: 'No converters found' });
            return;
        }
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});

// GET converter by id
app.get('/converter/find/:id', async (req, res) => {
    try {
        const result = await converters.findOne({ _id: new ObjectId(req.params.id) });

        if (!result) {
            res.status(404).send({ error: 'Converter not found' });
            return;
        }
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});

// POST new converter
app.post('/converter/save', async (req, res) => {
    try {
        
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
            res.status(500).send({ error: err });
        }
    }
    catch (err) {
        res.status(400).send({ error: 'Invalid request body: ' + err });
    }
});
