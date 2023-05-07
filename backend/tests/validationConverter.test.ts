import { sanitizeConverter } from "../src/converter/model";
import { validConverter } from "./testStructures";
import { validateConverter } from "../src/converter/service";

/* some converter tests are done in project tests because they are nested in project */

describe("Converter validation", () => {
    test("Valid converter", () => {
        expect(validateConverter(validConverter).isOk).toBe(true);
    });

    test("Additional property", () => {
        // expect object to pass check and equal validConverter
        const checked = validateConverter({ ...validConverter, additional: "property" });

        expect(checked.isOk).toBe(true);
        if (!checked.isOk) return;

        expect(checked.value).toEqual(validConverter);
    });

    test("Missing property", () => {
        expect(validateConverter({ ...validConverter, title: undefined }).isOk).toBe(false);
    });

    test("Empty object", () => {
        expect(validateConverter({}).isOk).toBe(false);
    });

    test("Null instead of converter", () => {
        expect(validateConverter(null).isOk).toBe(false);
        // but this should pass (because in project converter is optional)
        expect(sanitizeConverter(null)).toEqual(null);
    });

    // in POST id is only a hint and will not override existing converter
    // but specifiying id will be required in PUT to update existing converter
    test("Id present", () => {
        expect(validateConverter({ ...validConverter, _id: null }).isOk).toBe(false);
        expect(validateConverter({ ...validConverter, _id: "1234" }).isOk).toBe(false);

        expect(validateConverter({ ...validConverter, _id: 1 }).isOk).toBe(true);
        expect(validateConverter({ ...validConverter, _id: "0123456789abcdef01234567" }).isOk).toBe(true);
    });
});
