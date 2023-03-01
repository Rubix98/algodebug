import { ObjectId } from "mongodb";
import { Project } from "./model";
import { User } from "../user/model";
import { sanitizeBreakpoint } from "./structures/Breakpoint";
import { sanitizeSceneObject } from "./structures/SceneObject";
import { sanitizeTestCase } from "./structures/TestCase";

type validProjectOrError = [true, Project] | [false, unknown];

export const sanitizeProject = (p: Project) => {
    const result = {
        _id: p._id ? new ObjectId(p._id) : undefined,
        title: p.title,
        code: p.code,
        language: p.language,
        breakpoints: p.breakpoints.map(sanitizeBreakpoint),
        testData: p.testData.map(sanitizeTestCase),
        sceneObjects: p.sceneObjects.map(sanitizeSceneObject),
        modificationDate: p.modificationDate ?? new Date(),
    } as Project;

    if (p.author != null) result.author = p.author;
    if (p.creationDate != null) result.creationDate = p.creationDate;

    return result;
};

export const validateProject = (req: unknown): validProjectOrError => {
    try {
        return [true, sanitizeProject(Project.check(req))];
    } catch (error) {
        return [false, error];
    }
};

export const isUserAuthorised = (project: Project, userName: string): boolean => {
    return (project.author === "AlgoDebug" || userName !== undefined && project.author === userName);
};
