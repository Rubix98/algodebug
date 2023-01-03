import { Converter, sanitizeConverter } from "../models/Converter";
import { Variable, sanitizeVariable } from "./Variable";
import { ObjectType } from "./ObjectType";
import { Static, Record, String, Number, Null, Optional } from "runtypes";

export const SceneObject = Record({
    id: Number,
    parentId: Optional(Number),
    type: ObjectType,
    variable: Variable,
    converter: Converter.Or(Null),
    color: Optional(String),
});

export type SceneObject = Static<typeof SceneObject>;

export const sanitizeSceneObject = (s: SceneObject) => {
    return {
        id: s.id,
        type: s.type,
        variable: sanitizeVariable(s.variable),
        converter: sanitizeConverter(s.converter),
        color: s.color,
    } as SceneObject;
};
