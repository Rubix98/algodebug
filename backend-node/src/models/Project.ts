import { Breakpoint, sanitizeBreakpoint } from '../structures/Breakpoint';
import { TestCase, sanitizeTestCase } from '../structures/TestCase';
import { SceneObject, sanitizeSceneObject } from '../structures/SceneObject';
import { Language } from '../structures/Language';
import { Static, Record, String, Array, Null, Unknown, Optional, InstanceOf } from 'runtypes';

import { ObjectId } from 'mongodb';

const isId = (x: any): x is ObjectId => typeof x === 'string' || typeof x === 'number';

export const Project = Record({
    // project description
    title: String.withConstraint((s) => s.length > 0),
    description: String.Or(Null),

    // project data
    code: String,
    language: Language,
    breakpoints: Array(Breakpoint),
    testCases: Array(TestCase),
    sceneObjects: Array(SceneObject),

     // project metadata
    author: String,
    creationDate: InstanceOf(Date).Or(String),
    modificationDate: InstanceOf(Date).Or(String),

    _id: Optional(Unknown.withGuard(isId))
});

export type Project = Static<typeof Project>;

export const sanitizeProject = (p: Project) => {
    return {
        title: p.title,
        description: p.description,
        code: p.code,
        language: p.language,
        breakpoints: p.breakpoints.map(sanitizeBreakpoint),
        testCases: p.testCases.map(sanitizeTestCase),
        sceneObjects: p.sceneObjects.map(sanitizeSceneObject),
        author: p.author,
        creationDate: new Date(p.creationDate),
        modificationDate: new Date(p.modificationDate),
        _id: p._id ? new ObjectId(p._id) : undefined
    } as Project;
}
