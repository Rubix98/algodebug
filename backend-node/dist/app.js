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
import { InitializeConnection } from './dbservice';
// initialize database connection
const { projects, converters } = await InitializeConnection();
// initialize express app
const app = express();
/* Middleware */
// allow cross-origin requests for all origins in config
app.use(cors({ origin: process.env.ORIGINS }));
// parse request body as JSON
app.use(express.json());
// attach application/json header to all responses
app.use((req, res, next) => { res.setHeader('Content-Type', 'application/json'); next(); });
app.listen(process.env.PORT, () => {
    console.log(`Server is running on: http://localhost:${process.env.PORT}`);
});
/* API endpoints */
// GET all projects
app.get('/project/findAll', async (_req, res) => {
    try {
        const result = await projects.find({}).toArray();
        if (!result || result.length === 0) {
            res.status(202).send({ message: 'No projects found' });
        }
        else {
            res.status(200).json(result);
        }
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
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
// POST new project
app.post('/project/create', async (req, res) => {
    // TODO validate request body
    const toPost = req.body;
    try {
        const result = await projects.insertOne(toPost);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
// GET all converters
app.get('/converter/findAll', async (_req, res) => {
    try {
        const result = await converters.find({}).toArray();
        if (!result || result.length === 0) {
            res.status(202).send({ message: 'No converters found' });
        }
        else {
            res.status(200).json(result);
        }
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
        }
        else {
            res.status(200).json(result);
        }
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
// POST new project
app.post('/converter/create', async (req, res) => {
    // TODO validate request body
    const toPost = req.body;
    try {
        const result = await converters.insertOne(toPost);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
});
