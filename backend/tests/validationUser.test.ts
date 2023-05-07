import passport from "passport";
import { validateUser, validateUserUpdate } from "../src/user/service";
import { Uuid } from "../src/user/structures/Uuid";
import { validUserProile, validUser } from "./testStructures";
import { ObjectId } from "mongodb";

describe("User validation", () => {
    test("New user", () => {
        const data = validUserProile;

        const uuid = { id: data.id, provider: "google" } as Uuid;
        const user = validateUser({
            uuid: uuid,
            username: data.displayName,

            email: data.emails && data.emails.length > 0 ? data.emails[0].value : null,
            picture: data.photos && data.photos.length > 0 ? data.photos[0].value : null,
        });

        expect(user.isOk).toBe(true);
        if (!user.isOk) return;

        const insertedId = new ObjectId("0123456789abcdef01234567");
        expect(validateUser({ ...user.value, _id: insertedId }).isOk).toBe(true);
    });

    test("New user without email and photo", () => {
        const data = { ...validUserProile, emails: [], photos: [] } as passport.Profile;

        const uuid = { id: data.id, provider: "google" } as Uuid;
        const user = validateUser({
            uuid: uuid,
            username: data.displayName,

            email: data.emails && data.emails.length > 0 ? data.emails[0].value : null,
            picture: data.photos && data.photos.length > 0 ? data.photos[0].value : null,
        });

        expect(user.isOk).toBe(true);
        if (!user.isOk) return;

        const insertedId = new ObjectId("0123456789abcdef01234567");
        expect(validateUser({ ...user.value, _id: insertedId }).isOk).toBe(true);
    });

    test("Invalid user", () => {
        expect(validateUser({}).isOk).toBe(false);
        expect(validateUser({ uuid: { id: "123", provider: "google" } as Uuid }).isOk).toBe(false);
        expect(validateUser({ username: "123" }).isOk).toBe(false);
        expect(validateUser({ uuid: { id: "123", provider: "google" } as Uuid, username: 123 }).isOk).toBe(false);
        expect(validateUser({ ...validUser, uuid: { id: "1234", provider: "fake" } }).isOk).toBe(false);
    });

    test("User update", () => {
        const user = validUser;
        expect(validateUserUpdate(user).isOk).toBe(true);
        expect(validateUserUpdate({ username: "newname" }).isOk).toBe(true);

        // if object has fields that are not in the user structure, they are ignored
        // so all of these are valid

        expect(validateUserUpdate({ username: "newname", new: "field" }).isOk).toBe(true);
        expect(validateUserUpdate({}).isOk).toBe(true);

        const checked = validateUserUpdate({ some: "random", data: "here" });
        expect(checked.isOk).toBe(true);
        if (!checked.isOk) return;
        expect(checked.value).toEqual({});
    });
});
