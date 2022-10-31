import { Breakpoint } from '../structures/Breakpoint';
import { TestCase } from '../structures/TestCase';
import { SceneObject } from '../structures/SceneObject';

import { ObjectId } from 'mongodb';

export class Project {

    constructor(
        // project description
        public title: string,
        public description: string,

        // project data
        public code: string,
        public language: string,
        public breakpoints: Breakpoint[],
        public testCases: TestCase[],
        public sceneObjects: SceneObject[],

        // project metadata
        public author: string,
        public creationDate: Date,
        public lastModified: Date,

        public id?: ObjectId,
    ) {
        this.title = title;
        this.description = description;
        this.code = code;
        this.language = language;
        this.breakpoints = breakpoints;
        this.testCases = testCases;
        this.sceneObjects = sceneObjects;
        this.author = author;
        this.creationDate = creationDate;
        this.lastModified = lastModified;
        this.id = id;
    }
}
