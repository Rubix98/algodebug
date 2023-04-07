import { Breakpoint, sanitizeBreakpoint } from "./structures/Breakpoint";
import { TestCase, sanitizeTestCase } from "./structures/TestCase";
import { SceneObject, sanitizeSceneObject } from "./structures/SceneObject";
import { Uuid, sanitizeUuid } from "../user/structures/Uuid";
import { Language } from "../converter/structures/Language";

import { Static, Record, String, Array, Unknown, Optional, Boolean } from "runtypes";
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
    public: Boolean,
    authorId: Uuid,
    creationDate: Optional(Unknown.withConstraint(isValidDate)),
    modificationDate: Optional(Unknown.withConstraint(isValidDate)),
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

        public: p.public,
        modificationDate: p.modificationDate ?? new Date(),
    } as Project;

    if (p.authorId != null) result.authorId = sanitizeUuid(p.authorId);
    if (p.creationDate != null) result.creationDate = p.creationDate;

    return result;
};
