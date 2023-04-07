import { ValidTypeOrError } from "../types";
import { User } from "../user/model";
import { Project, sanitizeProject } from "./model";

export const validateProject = (req: unknown): ValidTypeOrError<Project> => {
    try {
        return [true, sanitizeProject(Project.check(req))];
    } catch (error) {
        return [false, error];
    }
};

export const isUserAuthor = (project: Project, user: User): boolean => {
    return project.authorId.id === user?._id.id && project.authorId.provider === user?._id.provider;
};

export const isUserAuthorised = (project: Project, user: User): boolean => {
    return isUserAuthor(project, user) || project.public;
};
