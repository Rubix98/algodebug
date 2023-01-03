import { validateConverter, validateProject } from "../src/services/dbservice";
import { Converter } from "../src/models/Converter";
import { Project } from "../src/models/Project";
import { Breakpoint } from "../src/structures/Breakpoint";
import { Language } from "../src/structures/Language";
import { Variable } from "../src/structures/Variable";
import { ObjectType } from "../src/structures/ObjectType";
import { TestCase } from "../src/structures/TestCase";
import { sanitizeConverter } from "../src/models/Converter";

const checkProject = (o: unknown) => {
    // might throw an error
    Project.check(o);

    const [isOk, project] = validateProject(o);
    if (!isOk) {
        return { ok: false, error: project };
    }
    return { ok: true, value: project };
};

const checkConverter = (o: unknown) => {
    // might throw an error
    Converter.check(o);

    const [isOk, converter] = validateConverter(o);
    if (!isOk) {
        return { ok: false, error: converter };
    }
    return { ok: true, value: converter };
};

let validConverter = {
    title: "nonempty",
    language: "cpp" as Language,
    code: "",
} as Converter;

let validProject = {
    title: "nonempty",
    code: "",
    language: "cpp" as Language,
    breakpoints: [],
    testData: [],
    sceneObjects: [],
    author: "nonempty",
} as Project;

let validNestedProject = {
    ...validProject,
    breakpoints: [{ id: 1 } as Breakpoint, { id: 2 } as Breakpoint, { id: 3 } as Breakpoint],
    testData: [{ id: 0, input: "some\ninput" } as TestCase, { id: 0, input: "some other input" } as TestCase],
    sceneObjects: [
        {
            id: 1,
            type: "graph" as ObjectType,
            variable: { id: "", start: 0, end: 1, name: "" } as Variable,
            converter: validConverter,
            color: "#000000",
        },
    ],
} as Project;

// some jest unit tests for jsons that can be recived by API
// this only tests validation functions, not the API itself
describe("Project validation", () => {
    test("Valid project", () => {
        expect(checkProject(validProject).ok).toBe(true);
    });

    test("Additional property", () => {
        // expect object to pass check and equal validProject
        const checked = checkProject({ ...validProject, additional: "property" });
        expect(checked.ok).toBe(true);
        // ignore the difference in creation and modification date
        expect(checked.value).toEqual({
            ...validProject,
            creationDate: undefined,
            modificationDate: undefined,
        });
    });

    test('Addtional property named "constructor" (edge case)', () => {
        // TODO more descriptive error message OR fix edge case
        expect(() => checkProject({ ...validProject, constructor: "property" })).toThrow();
    });

    test("Missing property", () => {
        expect(() => checkProject({ ...validProject, title: undefined })).toThrow();
    });

    test("Empty title", () => {
        expect(() => checkProject({ ...validProject, title: "" })).toThrow();
    });

    test("Empty object", () => {
        expect(() => checkProject({})).toThrow();
    });

    test("Date in request", () => {
        // we expect check to throw an error
        // because we don't want to allow users to set creationDate and modificationDate
        // and there is no way to pass Date object through json (only primitive types)
        expect(() => checkProject({ ...validProject, creationDate: "01.01.2022" })).toThrow();
        expect(() => checkProject({ ...validProject, modificationDate: new Date().toString() })).toThrow();
        expect(() => checkProject({ ...validProject, creationDate: 1234 })).toThrow();
        expect(() => checkProject({ ...validProject, modificationDate: null })).toThrow();

        // this should pass
        expect(() => checkProject({ ...validProject, creationDate: new Date("01.01.2022") })).not.toThrow();
        expect(() => checkProject({ ...validProject, modificationDate: new Date() })).not.toThrow();
    });

    test("Adding date", () => {
        // check if date is added and is of type Date
        let checked = checkProject({ ...validProject, creationDate: undefined });
        expect(checked.ok).toBe(true);
        if (checked.value) expect(checked.value.creationDate).toBe(undefined);

        checked = checkProject({ ...validProject, modificationDate: undefined });
        expect(checked.ok).toBe(true);
        if (checked.value) expect(checked.value.modificationDate).toBe(undefined);
    });

    test("Valid project with nested objects", () => {
        expect(checkProject(validNestedProject).ok).toBe(true);
    });

    test("Invalid nested object", () => {
        expect(() =>
            checkProject({
                ...validNestedProject,
                sceneObjects: [{ ...validNestedProject.sceneObjects[0], type: "invalid" }],
            })
        ).toThrow();
    });

    test("Nested object with additional property", () => {
        // expect object to pass check and equal validNestedProject
        const checked = checkProject({
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
            creationDate: undefined,
            modificationDate: undefined,
        });
    });

    // in POST id is only hint but will not override existing object
    // but specifiying id will be required in PUT to update existing object
    test("Id present", () => {
        expect(() => checkProject({ ...validProject, _id: null })).toThrow();
        expect(() => checkProject({ ...validProject, _id: "1234" })).toThrow();

        // expect to pass check
        expect(() => checkProject({ ...validProject, _id: 1 })).not.toThrow();
        expect(checkProject({ ...validProject, _id: 1 }).ok).toBe(true);
        expect(() => checkProject({ ...validProject, _id: "0123456789abcdef01234567" })).not.toThrow();
        expect(checkProject({ ...validProject, _id: "0123456789abcdef01234567" }).ok).toBe(true);
    });
});

// some converter tests are done in project tests because they are nested in project
describe("Converter validation", () => {
    test("Valid converter", () => {
        expect(checkConverter(validConverter).ok).toBe(true);
    });

    test("Additional property", () => {
        // expect object to pass check and equal validConverter
        const checked = checkConverter({ ...validConverter, additional: "property" });
        expect(checked.ok).toBe(true);
        expect(checked.value).toEqual(validConverter);
    });

    test("Missing property", () => {
        expect(() => checkConverter({ ...validConverter, title: undefined })).toThrow();
    });

    test("Empty object", () => {
        expect(() => checkConverter({})).toThrow();
    });

    test("Null instead of converter", () => {
        expect(() => checkConverter(null)).toThrow();
        // but this should pass (because in project converter is optional)
        expect(sanitizeConverter(null)).toEqual(null);
    });

    // in POST id is only hint but will not override existing object
    // but specifiying id will be required in PUT to update existing object
    test("Id present", () => {
        expect(() => checkConverter({ ...validConverter, _id: null })).toThrow();
        expect(() => checkConverter({ ...validConverter, _id: "1234" })).toThrow();

        // expect to pass check
        expect(() => checkConverter({ ...validConverter, _id: 1 })).not.toThrow();
        expect(checkConverter({ ...validConverter, _id: 1 }).ok).toBe(true);
        expect(() => checkConverter({ ...validConverter, _id: "0123456789abcdef01234567" })).not.toThrow();
        expect(checkConverter({ ...validConverter, _id: "0123456789abcdef01234567" }).ok).toBe(true);
    });
});
