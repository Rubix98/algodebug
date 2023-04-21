import { ValidTypeOrError } from "../types";
import { User } from "../user/model";
import { Project, sanitizeProject } from "./model";
import { ProjectLike } from "../types";
import { getCollections } from "../db";
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
        $unset: ["author.uuid", "author.email"],
    },
];

const canUserReadProjectDBQuery = (userId: ObjectId) => ({ $match: { $or: [{ public: true }, { authorId: userId }] } });

export const validateProject = (req: unknown): ValidTypeOrError<Project> => {
    try {
        return [true, sanitizeProject(Project.check(req))];
    } catch (error) {
        return [false, error];
    }
};

const isUserAuthorOfProject = (user: User, project: ProjectLike): boolean => {
    return project.authorId.equals(new ObjectId(user?._id));
};

export const canUserReadProject = (user: User, project: ProjectLike): boolean => {
    return project.public || isUserAuthorOfProject(user, project);
};

export const canUserEditProject = (user: User, project: ProjectLike): boolean => {
    return isUserAuthorOfProject(user, project);
};

/**
 * Returns all projects which user is authorised to see with author information included as author field.
 * If user is not provided, only public projects are returned.
 * Can throw when database error occurs.
 */
export const getAllProjectsWithAuthor = async (user?: User): Promise<ProjectLike[]> => {
    const { projects } = getCollections();
    const id = new ObjectId(user?._id);

    const result = await projects
        .aggregate([
            canUserReadProjectDBQuery(id),
            ...authorLookup,
            {
                $addFields: {
                    authorIsId: {
                        $cond: {
                            if: { $eq: ["$authorId", id] },
                            then: 1,
                            else: 0,
                        },
                    },
                },
            },
            { $sort: { authorIsId: -1, modificationDate: -1 } },
        ])
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
