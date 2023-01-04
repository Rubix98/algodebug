import { Breakpoint, sanitizeBreakpoint } from "../structures/Breakpoint";
import { TestCase, sanitizeTestCase } from "../structures/TestCase";
import { SceneObject, sanitizeSceneObject } from "../structures/SceneObject";
import { Language } from "../structures/Language";
import { Static, Record, String, Array, Null, Unknown, Optional } from "runtypes";

import { ObjectId } from "mongodb";

// this message doesn't really show up in response [TODO: fix]
const dateError = "Date cannot be passed in request. It is set automatically.";

const isId = (x: any): x is ObjectId => {
    if (!x) return false;
    try {
        new ObjectId(x);
        return true;
    } catch (e) {
        return false;
    }
};

const isValidDate = (x: any): x is Date => x instanceof Date && !isNaN(x.getTime());

export const Project = Record({
    _id: Optional(Unknown.withGuard(isId)),

    // project description
    title: String.withConstraint((s) => s.length > 0),

    // project data
    code: String,
    language: Language,
    breakpoints: Array(Breakpoint),
    testData: Array(TestCase),
    sceneObjects: Array(SceneObject),

    // project metadata
    author: Optional(String.withConstraint((s) => s.length > 0)),
    creationDate: Optional(Unknown.withConstraint(isValidDate || dateError)),
    modificationDate: Optional(Unknown.withConstraint(isValidDate || dateError)),
});

export type Project = Static<typeof Project>;

export const sanitizeProject = (p: Project) => {
    const result = {
        _id: p._id ? new ObjectId(p._id) : undefined,
        title: p.title,
        code: p.code,
        language: p.language,
        breakpoints: p.breakpoints.map(sanitizeBreakpoint),
        testData: p.testData.map(sanitizeTestCase),
        sceneObjects: p.sceneObjects.map(sanitizeSceneObject),
        modificationDate: p.modificationDate ?? new Date(),
    } as Project;

    if (p.author != null) result.author = p.author;
    if (p.creationDate != null) result.creationDate = p.creationDate;

    return result;
};
