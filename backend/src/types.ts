export type ValidTypeOrError<T> = { isOk: true; value: T } | { isOk: false; error: any };

/**
 * This type is used to allow for additional properties to be added to the T type
 * while still allowing the type to be used as a T type.
 */
export type TypeLike<T> = T & {
    [key: string]: any;
};

/**
 * Allows every property of T to be optional
 */
export type Subset<T> = {
    [P in keyof T]?: T[P];
};
