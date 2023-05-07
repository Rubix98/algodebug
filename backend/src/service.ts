import { Collection, MongoClient, ObjectId } from "mongodb";
import { Project } from "./project/model";
import { Converter } from "./converter/model";
import { User } from "./user/model";
import { ValidTypeOrError } from "./types";
import { isPromise } from "node:util/types";

let projectCollection: Collection<Project>;
let converterCollection: Collection<Converter>;
let userCollection: Collection<User>;

export const getCollections = () => {
    return {
        projects: projectCollection,
        converters: converterCollection,
        users: userCollection,
    };
};

export const initializeDatabase = async () => {
    try {
        const client = new MongoClient(process.env.DATABASE_URI as string);
        await client.connect();
        const database = client.db(process.env.DATABASE_NAME);

        projectCollection = database.collection<Project>("projects");
        converterCollection = database.collection<Converter>("converters");
        userCollection = database.collection<User>("users");

        console.log("Successfully connected to database");
    } catch (error) {
        console.log("Error while connecting to database:");
        throw error;
    }
};

export const asyncTryCatchAssign = async <T>(promise: Promise<T> | (() => Promise<T>)): Promise<ValidTypeOrError<T>> => {
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

export const isObjectId = (x: any): x is ObjectId => {
    if (!x) return false;
    try {
        new ObjectId(x);
        return true;
    } catch (e) {
        return false;
    }
};
