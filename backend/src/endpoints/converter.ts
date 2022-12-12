import { getCollection, validate } from "../services/dbservice";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

import { Converter } from "../models/Converter";

export const getAllConverters = async (_req: Request, res: Response) => {
    const converters = getCollection("converters");
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
    const converters = getCollection("converters");
    try {
        const id = new ObjectId(req.params.id);

        try {
            const result = await converters.findOne({ _id: id });

            if (!result) {
                res.status(404).json({ error: "No converter found with given id" });
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

/**
 * Can be used to create a new converter or to update an existing one
 */
export const updateConverter = async (req: Request, res: Response) => {
    const converters = getCollection("converters");
    const [isOk, data] = await validate(req.body, Converter, "Converter");

    if (!isOk || !data) {
        res.status(400).send({ error: "Invalid request body: " + data });
        return;
    }

    try {
        const id = new ObjectId(req.params.id);

        try {
            const result = await converters.updateOne({ _id: id }, { $set: data });
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    } catch {
        res.status(400).json({ error: "Invalid id" });
    }
};
