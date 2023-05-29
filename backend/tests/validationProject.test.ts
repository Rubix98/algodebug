import { Breakpoint } from "../src/project/structures/Breakpoint";
import { validProject, validNestedProject } from "./testStructures";
import { validateProject } from "../src/project/service";

describe("Project validation", () => {
    test("Valid project", () => {
        expect(validateProject(validProject).isOk).toBe(true);
    });

    test("Additional property", () => {
        // expect object to pass check and equal validProject
        const checked = validateProject({ ...validProject, additionalProperty: "property" });
        expect(checked.isOk).toBe(true);
        if (!checked.isOk) return;

        // ignore the difference in creation and modification date
        expect(checked.value).toEqual({
            ...validProject,
            modificationDate: expect.any(Date),
        });
    });

    test('Addtional property named "constructor" (edge case)', () => {
        // TODO more descriptive error message OR fix edge case
        expect(validateProject({ ...validProject, constructor: "property" }).isOk).toBe(false);
    });

    test("Missing property", () => {
        expect(validateProject({ ...validProject, title: undefined }).isOk).toBe(false);
    });

    test("Empty title", () => {
        expect(validateProject({ ...validProject, title: "" }).isOk).toBe(false);
    });

    test("Empty object", () => {
        expect(validateProject({}).isOk).toBe(false);
    });

    test("Date in request", () => {
        // we expect check to fail
        // because we don't want to allow users to set creationDate and modificationDate
        // and there is no way to pass Date object through json (only primitive types)

        expect(validateProject({ ...validProject, creationDate: "01.01.2022" }).isOk).toBe(false);
        expect(validateProject({ ...validProject, modificationDate: new Date().toString() }).isOk).toBe(false);
        expect(validateProject({ ...validProject, creationDate: 1234 }).isOk).toBe(false);
        expect(validateProject({ ...validProject, modificationDate: null }).isOk).toBe(false);

        // this should pass
        expect(validateProject({ ...validProject, creationDate: new Date("01.01.2022") }).isOk).toBe(true);
        expect(validateProject({ ...validProject, modificationDate: new Date() }).isOk).toBe(true);
        expect(validateProject({ ...validProject, modificationDate: undefined }).isOk).toBe(true);
    });

    test("Adding date", () => {
        // check if date is added and is of type Date
        let checked = validateProject({ ...validProject, creationDate: undefined });
        expect(checked.isOk).toBe(true);
        if (!checked.isOk) return;
        expect(checked.value.creationDate).toBe(undefined);

        checked = validateProject({ ...validProject, modificationDate: undefined });
        expect(checked.isOk).toBe(true);
        if (!checked.isOk) return;
        expect(checked.value.modificationDate).toBeInstanceOf(Date);
    });

    test("Valid project with nested objects", () => {
        expect(validateProject(validNestedProject).isOk).toBe(true);
    });

    test("Invalid nested object", () => {
        expect(
            validateProject({
                ...validNestedProject,
                sceneObjects: [{ ...validNestedProject.sceneObjects[0], type: "invalid" }],
            }).isOk
        ).toBe(false);
    });

    test("Nested object with additional property", () => {
        // expect object to pass check and equal validNestedProject
        const checked = validateProject({
            ...validNestedProject,
            breakpoints: [
                { id: 1, additional: "property" } as Breakpoint,
                { id: 2 } as Breakpoint,
                { id: 3 } as Breakpoint,
            ],
        });

        expect(checked.isOk).toBe(true);
        if (!checked.isOk) return;

        // ignore the difference in creation and modification date
        expect(checked.value).toEqual({
            ...validNestedProject,
            modificationDate: expect.any(Date),
        });
    });

    // in POST id is only a hint and will not override existing project
    // but specifiying id will be required in PUT to update existing project
    test("Id present", () => {
        expect(validateProject({ ...validProject, _id: null }).isOk).toBe(false);
        expect(validateProject({ ...validProject, _id: "1234" }).isOk).toBe(false);

        expect(validateProject({ ...validProject, _id: 1 }).isOk).toBe(true);
        expect(validateProject({ ...validProject, _id: "0123456789abcdef01234567" }).isOk).toBe(true);
    });
});
