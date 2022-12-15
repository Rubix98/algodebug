import { validate } from "../src/services/dbservice";
import { Converter } from "../src/models/Converter";
import { Project } from "../src/models/Project";
import { Breakpoint } from "../src/structures/Breakpoint";
import { Language } from "../src/structures/Language";
import { Mark } from "../src/structures/Mark";
import { ObjectType } from "../src/structures/ObjectType";
import { SceneObject } from "../src/structures/SceneObject";
import { TestCase } from "../src/structures/TestCase";
import { sanitize as sanitizeConverter } from "../src/models/Converter";
import { rejects } from "assert";

const checkProject = async (o: unknown) => {
    // might throw an error
    Project.check(o);

    const [isOk, project] = await validate(o, Project, "Project");
    if (!isOk) {
        return { ok: false, error: project };
    }
    return { ok: true, value: project };
};

const checkConverter = async (o: unknown) => {
    // might throw an error
    Converter.check(o);

    const [isOk, converter] = await validate(o, Converter, "Converter");
    if (!isOk) {
        return { ok: false, error: converter };
    }
    return { ok: true, value: converter };
};

let validConverter = {
    title: "nonempty",
    language: "cpp" as Language,
    code: "",
    type: null,
} as Converter;

let validProject = {
    title: "nonempty",
    description: null,
    code: "",
    language: "cpp" as Language,
    breakpoints: [],
    testCases: [],
    sceneObjects: [],
    author: "nonempty",
} as Project;

let validNestedProject = {
    ...validProject,
    breakpoints: [{ id: 1 } as Breakpoint, { id: 2 } as Breakpoint, { id: 3 } as Breakpoint],
    testCases: [{ input: "some\ninput" } as TestCase, { input: "some other input" } as TestCase],
    sceneObjects: [
        {
            id: 1,
            type: { key: "somekey", label: "somelabel", image: null } as ObjectType,
            variable: { start: 0, end: 1, name: "", type: null, converter: validConverter } as Mark,
            converter: validConverter,
            color: "#000000",
            subobjects: [
                {
                    id: 1,
                    type: { key: "somekey", label: "somelabel", image: null } as ObjectType,
                    variable: { start: 0, end: 1, name: "", type: null, converter: validConverter } as Mark,
                    converter: validConverter,
                    color: "#000000",
                    subobjects: [],
                } as SceneObject,
            ],
        },
    ],
} as Project;

// some jest unit tests for jsons that can be recived by API
// this only tests validation functions, not the API itself
describe("Project validation", () => {
    test("Valid project", async () => {
        expect((await checkProject(validProject)).ok).toBe(true);
    });

    test("Additional property", async () => {
        // expect object to pass check and equal validProject
        const checked = await checkProject({ ...validProject, additional: "property" });
        expect(checked.ok).toBe(true);
        // ignore the difference in creation and modification date
        expect(checked.value).toEqual({
            ...validProject,
            creationDate: expect.any(Date),
            modificationDate: expect.any(Date),
        });
    });

    test('Addtional property named "constructor" (edge case)', () => {
        // TODO more descriptive error message OR fix edge case
        expect(async () => await checkProject({ ...validProject, constructor: "property" })).rejects.toThrow();
    });

    test("Missing property", () => {
        expect(async () => (await checkProject({ ...validProject, title: undefined }))).rejects.toThrow();
    });

    test("Empty title", () => {
        expect(async () => (await checkProject({ ...validProject, title: "" }))).rejects.toThrow();
    });

    test("Empty object", () => {
        expect(async () => (await checkProject({}))).rejects.toThrow();
    });

    test("Date in request", () => {
        // we expect check to throw an error
        // because we don't want to allow users to set creationDate and modificationDate
        // and there is no way to pass Date object through json (only primitive types)
        expect(async () => (await checkProject({ ...validProject, creationDate: "01.01.2022" }))).rejects.toThrow();
        expect(async () => (await checkProject({ ...validProject, modificationDate: new Date().toString() }))).rejects.toThrow();
        expect(async () => (await checkProject({ ...validProject, creationDate: 1234 }))).rejects.toThrow();
        expect(async () => (await checkProject({ ...validProject, modificationDate: null }))).rejects.toThrow();

        // this should pass
        expect(async () => (await checkProject({ ...validProject, creationDate: new Date("01.01.2022") }))).not.toThrow();
        expect(async () => (await checkProject({ ...validProject, modificationDate: new Date() }))).not.toThrow();
    });

    test("Adding date", async () => {
        // check if date is added and is of type Date
        let checked = await checkProject({ ...validProject, creationDate: undefined });
        expect(checked.ok).toBe(true);
        if (checked.value) expect(checked.value.creationDate).toBeInstanceOf(Date);

        checked = await checkProject({ ...validProject, modificationDate: undefined });
        expect(checked.ok).toBe(true);
        if (checked.value) expect(checked.value.modificationDate).toBeInstanceOf(Date);
    });

    test("Valid project with nested objects", async () => {
        expect((await checkProject(validNestedProject)).ok).toBe(true);
    });

    test("Invalid nested object", () => {
        expect(
            async () =>
                await checkProject({
                    ...validNestedProject,
                    sceneObjects: [{ ...validNestedProject.sceneObjects[0], type: "invalid" }],
                })
        ).rejects.toThrow();
    });

    test("Nested object with additional property", async () => {
        // expect object to pass check and equal validNestedProject
        const checked = await checkProject({
            ...validNestedProject,
            breakpoints: [
                { id: 1, additional: "property" } as Breakpoint,
                { id: 2 } as Breakpoint,
                { id: 3 } as Breakpoint,
            ],
        });
        expect(checked.ok).toBe(true);
        // ignore the difference in creation and modification date
        expect(checked.value).toEqual({
            ...validNestedProject,
            creationDate: expect.any(Date),
            modificationDate: expect.any(Date),
        });
    });

    // in POST id is only hint but will not override existing object
    // but specifiying id will be required in PUT to update existing object
    test("Id present", async () => {
        expect(async () => await checkProject({ ...validProject, _id: null })).rejects.toThrow();
        expect(async () => await checkProject({ ...validProject, _id: "1234" })).rejects.toThrow();

        // expect to pass check
        expect(async () => await checkProject({ ...validProject, _id: 1 })).not.toThrow();
        expect((await checkProject({ ...validProject, _id: 1 })).ok).toBe(true);
        expect(async () => await checkProject({ ...validProject, _id: "0123456789abcdef01234567" })).not.toThrow();
        expect((await checkProject({ ...validProject, _id: "0123456789abcdef01234567" })).ok).toBe(true);
    });
});

// some converter tests are done in project tests because they are nested in project
describe("Converter validation", () => {
    test("Valid converter", async () => {
        expect((await checkConverter(validConverter)).ok).toBe(true);
    });

    test("Additional property", async () => {
        // expect object to pass check and equal validConverter
        const checked = await checkConverter({ ...validConverter, additional: "property" });
        expect(checked.ok).toBe(true);
        expect(checked.value).toEqual(validConverter);
    });

    test("Missing property", () => {
        expect(async () => await checkConverter({ ...validConverter, title: undefined })).rejects.toThrow();
    });

    test("Empty object", () => {
        expect(async () => await checkConverter({})).rejects.toThrow();
    });

    test("Null instead of converter", () => {
        expect(async () => await checkConverter(null)).rejects.toThrow();
        // but this should pass (because in project converter is optional)
        expect(sanitizeConverter(null)).toEqual(null);
    });

    // in POST id is only hint but will not override existing object
    // but specifiying id will be required in PUT to update existing object
    test("Id present", async () => {
        expect(async () => await checkConverter({ ...validConverter, _id: null })).rejects.toThrow();
        expect(async () => await checkConverter({ ...validConverter, _id: "1234" })).rejects.toThrow();

        // expect to pass check
        expect(async () => await checkConverter({ ...validConverter, _id: 1 })).not.toThrow();
        expect((await checkConverter({ ...validConverter, _id: 1 })).ok).toBe(true);
        expect(async () => await checkConverter({ ...validConverter, _id: "0123456789abcdef01234567" })).not.toThrow();
        expect((await checkConverter({ ...validConverter, _id: "0123456789abcdef01234567" })).ok).toBe(true);
    });
});
