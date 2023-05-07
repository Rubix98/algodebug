import { ObjectId, WithId } from "mongodb";
import { Converter } from "../src/converter/model";
import { Language } from "../src/converter/structures/Language";
import { Project } from "../src/project/model";
import { Breakpoint } from "../src/project/structures/Breakpoint";
import { TestCase } from "../src/project/structures/TestCase";
import { ObjectType } from "../src/project/structures/ObjectType";
import { Variable } from "../src/project/structures/Variable";
import { SceneObject } from "../src/project/structures/SceneObject";
import { User } from "../src/user/model";

export const validConverter = {
    title: "nonempty",
    language: "cpp" as Language,
    code: "",
} as Converter;

export const validProject = {
    title: "nonempty",
    code: "",
    language: "cpp" as Language,
    breakpoints: [],
    testData: [],
    sceneObjects: [],
    public: false,
    authorId: new ObjectId("0123456789abcdef01234567"),
} as Project;

export const validNestedProject = {
    ...validProject,
    breakpoints: [{ id: 1 } as Breakpoint, { id: 2 } as Breakpoint, { id: 3 } as Breakpoint],
    testData: [{ id: 0, input: "some\ninput" } as TestCase, { id: 0, input: "some other input" } as TestCase],
    sceneObjects: [
        {
            id: 0,
            type: "graph" as ObjectType,
            variables: [{ id: "x@0", start: 0, end: 1, name: "x" }] as Variable[],
            converter: validConverter,
            color: "#000000",
            subobjects: [
                {
                    id: 0,
                    type: "variable" as ObjectType,
                    variables: [{ id: "y@2", start: 2, end: 3, name: "y" }] as Variable[],
                    converter: validConverter,
                    color: "#000000",
                    subobjects: [],
                } as SceneObject,
            ],
        },
    ],
} as Project;

export const validUserProile = {
    provider: "google",
    id: "1234567890",
    displayName: "nonempty",
    emails: [{ value: "test@example.com" }],
    photos: [{ value: "https://example.com/photo.jpg" }],
};

export const validUser = {
    _id: new ObjectId("0123456789abcdef01234567"),
    uuid: { id: "1234567890", provider: "google" },
    username: "nonempty",
    email: "test@example.com",
    picture: "https://example.com/photo.jpg",
} as WithId<User>;
