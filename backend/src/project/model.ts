import { Breakpoint } from "./structures/Breakpoint";
import { TestCase } from "./structures/TestCase";
import { SceneObject } from "./structures/SceneObject";
import { Language } from "../converter/structures/Language";
import { Static, Record, String, Array, Unknown, Optional } from "runtypes";

import { ObjectId } from "mongodb";

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
    creationDate: Optional(Unknown.withConstraint(isValidDate)),
    modificationDate: Optional(Unknown.withConstraint(isValidDate)),
});

export type Project = Static<typeof Project>;
