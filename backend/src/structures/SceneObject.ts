import { Converter, sanitizeConverter } from "../models/Converter";
import { Variable, sanitizeVariable } from "./Variable";
import { ObjectType } from "./ObjectType";
import { Record, String, Array, Number, Lazy, Runtype, Null, Undefined } from "runtypes";

// Lazy because subobject is recursive
export const SceneObject: Runtype<SceneObject> = Lazy(() =>
    Record({
        id: Number.Or(Null),
        type: ObjectType,
        variable: Variable,
        converter: Converter.Or(Null),
        color: String.Or(Null),
        subobjects: Array(SceneObject),
    })
);

// for same reason as above type is created manually instead of using Static
export type SceneObject = {
    id: number | null;
    type: ObjectType;
    variable: Variable;
    converter: Converter | null;
    color: string | null;
    subobjects: SceneObject[];
};

export const sanitizeSceneObject = (s: SceneObject): SceneObject => {
    return {
        id: s.id,
        type: s.type,
        variable: sanitizeVariable(s.variable),
        converter: sanitizeConverter(s.converter),
        color: s.color,
        subobjects: s.subobjects.map(sanitizeSceneObject),
    } as SceneObject;
};
