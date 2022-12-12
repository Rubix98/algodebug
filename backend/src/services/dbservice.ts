import { MongoClient, Collection } from "mongodb";
import { Static } from "runtypes";
import { Project } from "../models/Project";
import { Converter } from "../models/Converter";
import { CompilerMultiTestsRequest } from "../models/CompilerMultiTestsRequest";
import { User } from "../models/User";

export enum Collections {
    projects = "projects",
    converters = "converters",
    users = "users",
}

type CollectionNames = keyof typeof Collections;

const collections = new Map<CollectionNames, Collection>();

export const getCollection = (name: CollectionNames) => {
    const collection = collections.get(name);
    if (!collection) throw new Error(`Collection ${name} not found`);
    return collection;
};

export const initializeConnection = async () => {
    try {
        const client = new MongoClient(process.env.DATABASE_URI as string);

        await client.connect();

        const database = client.db(process.env.DATABASE_NAME);

        for (const collectionName of Object.values(Collections)) {
            collections.set(collectionName, database.collection(collectionName));
        }

        // mathod + id is unique
        getCollection("users").createIndex({ method: 1, id: 1 }, { unique: true });

        console.log("Successfully connected to database");
    } catch (error) {
        console.log("Error while connecting to database:");
        throw error;
    }
};

// warning: overengineered validation function below

type validTypeOrError<T> = [true, T] | [false, unknown];
type Template = typeof Project | typeof Converter | typeof CompilerMultiTestsRequest | typeof User;

// this function will check if the request body has all the required properties
// and silently remove any additional properties not defined in the template

export const validate = async <K extends Template>(
    req: unknown,
    T: K,
    name: string
): Promise<validTypeOrError<Static<typeof T>>> => {
    try {
        // import the sanitize function from the same file as the template
        const sanitizeFunction = (await import(`../models/${name}`)).sanitize;
        if (!sanitizeFunction) return [false, "Sanitize function not found"];
        return [true, sanitizeFunction(T.check(req))];
    } catch (error) {
        return [false, error];
    }
};
