import { Converter, sanitize as sanitizeConverter } from "../models/Converter";
import { Mark, sanitize as sanitizeMark } from "./Mark";
import { ObjectType, sanitize as sanitizeObjectType } from "./ObjectType";
import { Record, String, Array, Number, Lazy, Runtype, Null } from "runtypes";

// Lazy because subobject is recursive
export const SceneObject: Runtype<SceneObject> = Lazy(() =>
    Record({
        id: Number.Or(Null),
        type: ObjectType,
        variable: Mark,
        converter: Converter.Or(Null),
        color: String.Or(Null),
        subobjects: Array(SceneObject),
    })
);

// for same reason as above type is created manually instead of using Static
export type SceneObject = {
    id: number | null;
    type: ObjectType;
    variable: Mark;
    converter: Converter | null;
    color: string | null;
    subobjects: SceneObject[];
};

export const sanitize = (s: SceneObject): SceneObject => {
    return {
        id: s.id,
        type: sanitizeObjectType(s.type),
        variable: sanitizeMark(s.variable),
        converter: sanitizeConverter(s.converter),
        color: s.color,
        subobjects: s.subobjects.map(sanitize),
    } as SceneObject;
};
