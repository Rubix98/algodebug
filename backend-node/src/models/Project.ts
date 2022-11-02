import { Breakpoint } from '../structures/Breakpoint';
import { TestCase } from '../structures/TestCase';
import { SceneObject } from '../structures/SceneObject';
import { DialogData } from '../structures/DialogData';
import { LabelValue } from '../structures/LabelValue';

import { ObjectId } from 'mongodb';

export class Project {

    public dialogData: DialogData

    constructor(
        // project description
        public title: string = "",
        public description: string = "",

        // project data
        public code: string = "",
        public language: string = "",
        public breakpoints: Breakpoint[] = [],
        public testCases: TestCase[] = [],
        public sceneObjects: SceneObject[] = [],

        // project metadata
        public author: string = "AlgoDebug", // TODO: system logowania użytkowników
        public creationDate: Date = new Date(),
        public lastModified: Date = new Date(),

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

        this.dialogData = new DialogData(
            title,
            [
                new LabelValue("Tytuł", title),
                new LabelValue("Język programowania", language),
                new LabelValue("Autor", author),
                
                // format "yyyy-MM-dd HH:mm"
                new LabelValue("Data modyfikacji", lastModified.toISOString().slice(0, 16).replace('T', ' ')),
            ]
        )

        this.id = id ? id : new ObjectId();
    }
}
