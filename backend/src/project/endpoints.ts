import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollections } from "../app";
import { validateProject } from "./service";
import { User } from "../user/model";

export const isAuthenticated = (req: Request): string => {
    console.log(req.user);
    const user = req.user as User;
    const name = user?.username;

    if (user == null) {
        return "";
    }
    return name;
};

export const getAllProjects = async (req: Request, res: Response) => {
    const { projects } = getCollections();
    try {
        const username = isAuthenticated(req);
        const result = await projects
            .find({
                author: { $in: ["AlgoDebug", username] },
            })
            .toArray();

        if (!result || result.length === 0) {
            res.status(204).send();
        } else {
            res.status(200).json(result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    const { projects } = getCollections();
    try {
        const id = new ObjectId(req.params.id);

        try {
            const result = await projects.findOne({ _id: id });

            if (!result) {
                res.status(404).json({ error: "No project found with given id" });
                return;
            } else {
                const loggedUser = isAuthenticated(req);

                if (!loggedUser) {
                    if (result.author != "AlgoDebug") {
                        res.status(403).json({ error: "User is not authorised" });
                        return;
                    }
                } else {
                    if (result.author !== "AlgoDebug" && result.author !== loggedUser) {
                        res.status(403).json({ error: "User is not authorised" });
                        return;
                    }
                }
                res.status(200).json(result);
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } catch {
        res.status(400).json({ error: "Invalid id" });
    }
};

export const saveProject = async (req: Request, res: Response) => {
    const { projects } = getCollections();
    const [isOk, data] = validateProject(req.body);

    if (!isOk) {
        res.status(400).json({ error: "Invalid request body: " + data });
        return;
    }
    if (!req.user) {
        res.status(403).json({ error: "You must be logged in to save a project" });
        return;
    }
    const author = isAuthenticated(req);
    const project = { ...data, author, creationDate: new Date(), modificationDate: new Date() };

    try {
        const result = await projects.insertOne(project);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const updateProject = async (req: Request, res: Response) => {
    const { projects } = getCollections();
    const [isOk, data] = validateProject(req.body);

    if (!isOk) {
        res.status(400).json({ error: "Invalid request body: " + data });
        return;
    }
    if (!req.user) {
        res.status(403).json({ error: "You must be logged in to update a project" });
        return;
    }
    try {
        const id = new ObjectId(data._id);

        try {
            const user = req.user as User;
            data.author = user.username;
            data.modificationDate = new Date();
            const result = await projects.updateOne({ _id: id }, { $set: data });
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    } catch {
        res.status(400).json({ error: "Invalid id" });
    }
};
