import { Converter, sanitizeConverter } from "../models/Converter";
import { Mark, sanitizeMark } from "./Mark";
import { ObjectType, sanitizeObjectType } from "./ObjectType";
import { Record, String, Array, Number, Lazy, Runtype, Null } from 'runtypes';

export const SceneObject: Runtype<SceneObject> = Lazy(() => Record({
    id: Number.Or(Null),
    type: ObjectType,
    variable: Mark,
    converter: Converter.Or(Null),
    color: String.Or(Null),
    subobjects: Array(SceneObject)
}));

export type SceneObject = { id: number | null, type: ObjectType, variable: Mark, converter: Converter | null, color: string | null, subobjects: SceneObject[] }

export const sanitizeSceneObject = (s: SceneObject): SceneObject => {
    return {
        id: s.id,
        type: sanitizeObjectType(s.type),
        variable: sanitizeMark(s.variable),
        converter: sanitizeConverter(s.converter),
        color: s.color,
        subobjects: s.subobjects.map(sanitizeSceneObject)
    } as SceneObject;
}
