import { ValidTypeOrError } from "../shared/types";
import { User } from "../user/model";
import { RoleEnum } from "../user/structures/Role";
import { Project, sanitizeProject } from "./model";
import { TypeLike } from "../shared/types";
import { getCollections } from "../db";
import { ObjectId, WithId } from "mongodb";

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

const isAdmin = (user?: User): boolean => {
    return user?.role == RoleEnum.ADMIN;
};

const canUserReadProjectDBQuery = (user?: User) => {
    if (isAdmin(user)) {
        return { $match: {} };
    } else {
        return { $match: { $or: [{ public: true }, { authorId: new ObjectId(user?._id) }] } };
    }
};

export const validateProject = (req: unknown): ValidTypeOrError<Project> => {
    try {
        return { isOk: true, value: sanitizeProject(Project.check(req)) };
    } catch (error) {
        return { isOk: false, error: error };
    }
};

const isUserAuthorOfProject = (user: User, project: TypeLike<Project>): boolean => {
    return project.authorId.equals(new ObjectId(user?._id));
};

export const canUserReadProject = (user: User, project: TypeLike<Project>): boolean => {
    return project.public || isUserAuthorOfProject(user, project) || isAdmin(user);
};

export const canUserEditProject = (user: User, project: TypeLike<Project>): boolean => {
    return isUserAuthorOfProject(user, project) || isAdmin(user);
};

/**
 * Returns all projects which user is authorised to see with author information included as author field.
 * If user is not provided, only public projects are returned.
 * Can throw when database error occurs.
 */
export const getAllProjectsWithAuthor = async (user?: User): Promise<TypeLike<WithId<Project>>[]> => {
    const { projects } = getCollections();

    const result = await projects
        .aggregate([canUserReadProjectDBQuery(user), ...authorLookup])
        .sort({ modificationDate: -1 })
        .toArray();

    return result as TypeLike<WithId<Project>>[];
};

/**
 * Returns project with matching id with author information included as author field.
 * Can throw when database error occurs.
 */
export const getProjectByIdWithAuthor = async (projectId: ObjectId): Promise<TypeLike<WithId<Project>>> => {
    const { projects } = getCollections();

    const result = await projects.aggregate([{ $match: { _id: projectId } }, ...authorLookup]).next();

    return result as TypeLike<WithId<Project>>;
};
