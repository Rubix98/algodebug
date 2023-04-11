import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollections } from "../db";
import {
    validateProject,
    isUserAuthorised,
    isUserAuthor,
    getAllProjectsWithAuthor,
    getProjectByIdWithAuthor,
} from "./service";
import { User } from "../user/model";

export const getAllProjects = async (req: Request, res: Response) => {
    let result;

    try {
        result = await getAllProjectsWithAuthor(req.user as User);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
        return;
    }

    if (!result || result.length === 0) {
        res.status(404).json({ error: "No projects found" });
    } else {
        res.status(200).json(result);
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    let projectId, result;

    try {
        projectId = new ObjectId(req.params.id);
    } catch (err) {
        res.status(400).json({ error: "Invalid id" });
        return;
    }

    try {
        result = await getProjectByIdWithAuthor(projectId);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
        return;
    }

    if (!result) {
        res.status(404).json({ error: "No project found with given id" });
        return;
    }

    const user = req.user as User;

    if (isUserAuthorised(result, user)) {
        res.status(200).json(result);
    } else {
        res.status(403).json({ error: "User is not authorised" });
    }
};

export const saveProject = async (req: Request, res: Response) => {
    const { projects } = getCollections();
    const uuid = (req.user as User)?._id;

    const data = {
        ...req.body,
        authorId: uuid,
        // change this when we have a way to set project visibility in the frontend
        // public: req.body.public || false,
        public: false,
        creationDate: new Date(),
        modificationDate: new Date(),
    };

    const [isOk, project] = validateProject(data);

    if (!isOk) {
        res.status(400).json({ error: "Invalid request body: " + project });
        return;
    }

    try {
        const result = await projects.insertOne(data);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    const { projects } = getCollections();
    const user = req.user as User;

    const data = {
        ...req.body,
        authorId: user?._id,
        public: req.body.public || false,
        modificationDate: new Date(),
    };

    const [isOk, project] = validateProject(data);
    let projectId, projectToEdit;

    if (!isOk) {
        res.status(400).json({ error: "Invalid request body: " + project });
        return;
    }

    try {
        projectId = new ObjectId(project._id);
    } catch (err) {
        res.status(400).json({ error: "Invalid id" });
        return;
    }

    try {
        projectToEdit = await projects.findOne({ _id: projectId });
    } catch (err) {
        res.status(500).json({ error: "Database error" });
        return;
    }

    if (projectToEdit == null) {
        res.status(404).json({ error: "Project you wanted to edit does not exist" });
        return;
    }

    if (!isUserAuthor(projectToEdit, user)) {
        res.status(401).json({ error: "You are not authorised to edit this project" });
        return;
    }

    try {
        const result = await projects.updateOne({ _id: projectId }, { $set: project });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
};
