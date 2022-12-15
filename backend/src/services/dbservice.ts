import { MongoClient, Collection } from "mongodb";
import { Static } from "runtypes";
import { Project } from "../models/Project";
import { Converter } from "../models/Converter";
import { CompilerMultiTestsRequest } from "../models/CompilerMultiTestsRequest";
import { User } from "../models/User";
import { LoginMethod } from "../structures/LoginMethod";

let collections = {
    projects: {} as Collection<Project>,
    converters: {} as Collection<Converter>,
    users: {} as Collection<User>,
};

type CollectionNames = keyof typeof collections;

export const getCollection = <N extends CollectionNames>(name: N): typeof collections[N] => {
    const collection = collections[name];
    if (!collection) throw new Error(`Collection ${name} not found`);
    return collection;
};

export const getUser = async (method: LoginMethod, id: string) => {
    const users = getCollection("users");
    try {
        const result = await users.findOne({ method: method, id: id });
        return result;
    } catch (err) {
        return null;
    }
};

export const createNewUser = async (user: User) => {
    const users = getCollection("users");
    try {
        const result = await users.insertOne(user, { forceServerObjectId: false });
        return result;
    } catch (err) {
        return null;
    }
};

export const initializeConnection = async () => {
    try {
        const client = new MongoClient(process.env.DATABASE_URI as string);
        await client.connect();
        const database = client.db(process.env.DATABASE_NAME);

        collections.projects = database.collection<Project>("projects");
        collections.converters = database.collection<Converter>("converters");
        collections.users = database.collection<User>("users");

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
    toValidate: unknown,
    T: K,
    name: string // I don't think there's a way to get the name of a template or to somehow import it without using name
    // TODO: for people who wish to waste a lot of time on impossible task
): Promise<validTypeOrError<Static<typeof T>>> => {
    try {
        // import the sanitize function from the same file as the template
        const sanitizeFunction = (await import(`../models/${name}`)).sanitize;
        if (!sanitizeFunction) return [false, "Sanitize function not found"];
        return [true, sanitizeFunction(T.check(toValidate))];
    } catch (error) {
        return [false, error];
    }
};
