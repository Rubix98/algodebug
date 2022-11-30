import { MongoClient, Collection } from "mongodb";
import { Project, sanitizeProject } from "../models/Project";
import { Converter, sanitizeConverter } from "../models/Converter";
import { Code } from "../models/Code";

let projectCollection: Collection<Project>;
let converterCollection: Collection<Converter>;

export const getCollections = () => {
    return {
        projects: projectCollection,
        converters: converterCollection,
    };
};

export const InitializeConnection = async () => {
    try {
        const client = new MongoClient(process.env.DATABASE_URI as string);

        await client.connect();

        const database = client.db(process.env.DATABASE_NAME);
        projectCollection = database.collection<Project>("projects");
        converterCollection = database.collection<Converter>("converters");
        console.log("Successfully connected to database");
    } catch (error) {
        console.log("Error while connecting to database:");
        throw error;
    }
};

type validConverterOrError = [true, Converter] | [false, unknown];
type validProjectOrError = [true, Project] | [false, unknown];
type validCodeOrError = [true, Code] | [false, unknown];

// these functions will check if the request body has all the required properties
// and silently remove any additional properties not defined in the Project/Converter models

export const validateConverter = (req: unknown): validConverterOrError => {
    try {
        const converter = sanitizeConverter(Converter.check(req));
        if (!converter) throw new Error("Converter cannot be null");
        return [true, converter];
    } catch (error) {
        return [false, error];
    }
};

export const validateProject = (req: unknown): validProjectOrError => {
    try {
        return [true, sanitizeProject(Project.check(req))];
    } catch (error) {
        return [false, error];
    }
};

export const validateCode = (req: unknown): validCodeOrError => {
    try {
        return [true, Code.check(req)];
    } catch (error) {
        return [false, error];
    }
};
