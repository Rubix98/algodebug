import { getCollection, validate } from "../services/dbservice";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Project } from "../models/Project";

export const getAllProjects = async (req: Request, res: Response) => {
    console.log(req.cookies.AlgoToken); // if set user can be obtained from this token and used to filter projects

    const projects = getCollection("projects");
    try {
        const result = await projects.find({}).toArray();

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
    const projects = getCollection("projects");
    try {
        const id = new ObjectId(req.params.id);

        try {
            const result = await projects.findOne({ _id: id });

            if (!result) {
                res.status(404).json({ error: "No project found with given id" });
                return;
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
 * Can be used to create a new project or to update an existing one
 */
export const updateProject = async (req: Request, res: Response) => {
    const projects = getCollection("projects");
    const [isOk, data] = await validate(req.body, Project, "Project");

    if (!isOk) {
        res.status(400).json({ error: "Invalid request body: " + data });
        return;
    }

    try {
        const id = new ObjectId(data._id);

        try {
            const result = await projects.updateOne({ _id: id }, { $set: data });
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json(err);
        }
    } catch {
        res.status(400).json({ error: "Invalid id" });
    }
};
