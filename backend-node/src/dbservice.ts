import { MongoClient } from 'mongodb';
import { Project } from './models/Project';
import { Converter } from './models/Converter';

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
