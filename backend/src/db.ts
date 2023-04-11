import { Collection, MongoClient } from "mongodb";
import { Project } from "./project/model";
import { Converter } from "./converter/model";
import { User } from "./user/model";

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
