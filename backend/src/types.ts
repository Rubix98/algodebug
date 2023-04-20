import { Project } from "./project/model";

export type ValidTypeOrError<T> = [true, T] | [false, unknown];

/**
 * This type is used to allow for additional properties to be added to the Project type
 * while still allowing the type to be used as a Project type.
 */
export type ProjectLike = Project & {
    [key: string]: any;
};
