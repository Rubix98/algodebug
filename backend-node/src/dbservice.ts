import { MongoClient } from 'mongodb';
import { Project, sanitizeProject } from './models/Project';
import { Converter, sanitizeConverter } from './models/Converter';

export const InitializeConnection = async () => {
    try {
        const client = new MongoClient(process.env.DATABASE_URI as string);
        
        await client.connect();

        const database = client.db(process.env.DATABASE_NAME);
        const projects = database.collection<Project>('projects');
        const converters = database.collection<Converter>('converters');

        console.log('Successfully connected to database');
        return { projects, converters };
    }
    catch (error) {
        console.log('Error while connecting to database:');
        throw error;
    }
}

type validConverterOrError = [ true, Converter ] | [false, unknown ];
type validProjectOrError = [ true, Project ] | [false, unknown ];

export const validateConverter = (req: unknown): validConverterOrError => {
    try {
        // checks if the request body has all the required fields
        // and silently removes any additional properties not defined in the Converter type 
        const converter = sanitizeConverter(Converter.check(req));
        if (!converter) throw new Error('Converter cannot be null');
        return [true, converter];
    }
    catch (error) {
        return [false, error];
    }
}

export const validateProject = (req: unknown) : validProjectOrError => {
    try {
        // checks if the request body has all the required fields
        // and silently removes any additional properties not defined in the Project type 
        return [true, sanitizeProject(Project.check(req))];
    }
    catch (error) {
        return [false, error];
    }
}
