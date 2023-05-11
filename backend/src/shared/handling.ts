import { isPromise } from "util/types";
import { ValidTypeOrError } from "./types";

export const asyncTryCatchAssign = async <T>(
    promise: Promise<T> | (() => Promise<T>)
): Promise<ValidTypeOrError<T>> => {
    try {
        if (isPromise(promise)) {
            return { isOk: true, value: await promise };
        } else {
            return { isOk: true, value: await promise() };
        }
    } catch (err) {
        return { isOk: false, error: err };
    }
};
