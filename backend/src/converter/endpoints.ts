import { validateConverter } from "./service";
import { getCollections } from "../db";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

export const getAllConverters = async (_req: Request, res: Response) => {
    const { converters } = getCollections();
    let result;

    try {
        result = await converters.find({}).toArray();
    } catch (err) {
        res.status(500).json({ error: "Database error" });
        return;
    }

    if (!result || result.length === 0) {
        res.status(404).json({ error: "No converters found" });
    } else {
        res.status(200).json(result);
    }
};

export const getConverterById = async (req: Request, res: Response) => {
    const { converters } = getCollections();
    let id, result;

    try {
        id = new ObjectId(req.params.id);
    } catch (err) {
        res.status(400).json({ error: "Invalid id" });
        return;
    }

    try {
        result = await converters.findOne({ _id: id });
    } catch (err) {
        res.status(500).json({ error: "Database error" });
        return;
    }

    if (!result) {
        res.status(404).json({ error: "No converter found with given id" });
    } else {
        res.status(200).json(result);
    }
};

export const saveConverter = async (req: Request, res: Response) => {
    const { converters } = getCollections();
    const [isOk, data] = validateConverter(req.body);

    if (!isOk) {
        res.status(400).send({ error: "Invalid request body: " + data });
        return;
    }

    try {
        const result = await converters.insertOne(data);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
};

export const updateConverter = async (req: Request, res: Response) => {
    const { converters } = getCollections();
    const [isOk, data] = validateConverter(req.body);
    let id;

    if (!isOk) {
        res.status(400).send({ error: "Invalid request body: " + data });
        return;
    }

    try {
        id = new ObjectId(req.params.id);
    } catch (err) {
        res.status(400).json({ error: "Invalid id" });
        return;
    }

    try {
        const result = await converters.updateOne({ _id: id }, { $set: data });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};
