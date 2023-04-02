import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollections } from "../app";
import { validateProject, isUserAuthorised } from "./service";
import { User } from "../user/model";

export const getAuthenticatedUserName = (req: Request): string => {
    const user = req.user as User;
    return user?.username;
};

export const getAllProjects = async (req: Request, res: Response) => {
    const { projects } = getCollections();
    try {
        const username = getAuthenticatedUserName(req);
        const result = await projects
            .find({
                author: { $in: ["AlgoDebug", username] },
            })
            .sort({ modificationDate: -1 })
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
                const user = getAuthenticatedUserName(req);

                if (isUserAuthorised(result, user)) {
                    res.status(200).json(result);
                } else {
                    res.status(403).json({ error: "User is not authorised" });
                }
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
    const author = getAuthenticatedUserName(req);
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

    const user = req.user as User;

    try {
        var id = new ObjectId(data._id);
    } catch (err) {
        res.status(400).json({ error: "Invalid id" });
        return;
    }

    try {
        const projectToEdit = await projects.findOne({ _id: id });

        if (projectToEdit == null) {
            res.status(404).json({ error: "Project you wanted to edit does not exist" });
            return;
        }

        if (projectToEdit.author != user.username) {
            res.status(401).json({ error: "You are not authorised to edit this project" });
            return;
        }

        data.modificationDate = new Date();
        const result = await projects.updateOne({ _id: id }, { $set: data });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
};
