import { Static, Record, String, Null } from "runtypes";

export const ObjectType = Record({
    key: String,
    label: String,
    image: String.Or(Null),
});

export type ObjectType = Static<typeof ObjectType>;

export const sanitizeObjectType = (o: ObjectType) => {
    return {
        key: o.key,
        label: o.label,
        image: o.image,
    } as ObjectType;
};
