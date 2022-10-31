export class Project {
    title;
    description;
    code;
    language;
    breakpoints;
    testCases;
    sceneObjects;
    author;
    creationDate;
    lastModified;
    id;
    constructor(
    // project description
    title, description, 
    // project data
    code, language, breakpoints, testCases, sceneObjects, 
    // project metadata
    author, creationDate, lastModified, id) {
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
