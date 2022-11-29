import { getCollections, validateConverter } from "../services/dbservice";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

export const getAllConverters = async (_req: Request, res: Response) => {
    const { converters } = getCollections();
    try {
        const result = await converters.find({}).toArray();

        if (!result || result.length === 0) {
            res.status(204).send();
        } else {
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getConverterById = async (req: Request, res: Response) => {
    const { converters } = getCollections();
    try {
        const id = new ObjectId(req.params.id);

        try {
            const result = await converters.findOne({ _id: id });

            if (!result) {
                res.status(404).json({
                    error: "No converter found with given id",
                });
            } else {
                res.status(200).json(result);
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } catch {
        res.status(400).json({ error: "Invalid id" });
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
        res.status(500).json(err);
    }
};

export const updateConverter = async (req: Request, res: Response) => {
    const { converters } = getCollections();
    const [isOk, data] = validateConverter(req.body);

    if (!isOk) {
        res.status(400).send({ error: "Invalid request body: " + data });
        return;
    }

    try {
        const id = new ObjectId(req.params.id);

        try {
            const result = await converters.updateOne(
                { _id: id },
                { $set: data }
            );
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    } catch {
        res.status(400).json({ error: "Invalid id" });
    }
};
