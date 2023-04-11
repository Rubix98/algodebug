import { ValidTypeOrError } from "../types";
import { User } from "../user/model";
import { Project, sanitizeProject } from "./model";
import { ProjectLike } from "../types";
import { getCollections } from "../app";
import { ObjectId } from "mongodb";

const authorLookup = [
    {
        $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author",
        },
    },
    {
        $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        // here can be adjusted which user fields are returned
        $unset: ["author._id", "author.email"],
    },
];

export const validateProject = (req: unknown): ValidTypeOrError<Project> => {
    try {
        return [true, sanitizeProject(Project.check(req))];
    } catch (error) {
        return [false, error];
    }
};

export const isUserAuthor = (project: ProjectLike, user: User): boolean => {
    return project.authorId.id === user?._id.id && project.authorId.provider === user?._id.provider;
};

export const isUserAuthorised = (project: ProjectLike, user: User): boolean => {
    return isUserAuthor(project, user) || project.public;
};

/**
 * Returns all projects which user is authorised to see with author information included as author field.
 * If user is not provided, only public projects are returned.
 * Can throw when database error occurs.
 */
export const getAllProjectsWithAuthor = async (user?: User): Promise<ProjectLike[]> => {
    const { projects } = getCollections();
    const uuid = user?._id;

    const result = await projects
        .aggregate([{ $match: { $or: [{ public: true }, { authorId: uuid }] } }, ...authorLookup])
        .sort({ modificationDate: -1 })
        .toArray();

    return result as ProjectLike[];
};

/**
 * Returns project with matching id with author information included as author field.
 * Can throw when database error occurs.
 */
export const getProjectByIdWithAuthor = async (projectId: ObjectId): Promise<ProjectLike> => {
    const { projects } = getCollections();

    const result = await projects.aggregate([{ $match: { _id: projectId } }, ...authorLookup]).next();

    return result as ProjectLike;
};
