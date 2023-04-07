import { Converter, sanitizeConverter } from "../../converter/model";
import { Variable, sanitizeVariables } from "./Variable";
import { ObjectType } from "./ObjectType";
import { Record, String, Array, Number, Lazy, Runtype, Unknown, Optional, Null } from "runtypes";

// Lazy because subobject is recursive
export const SceneObject: Runtype<SceneObject> = Lazy(() =>
    Record({
        id: Number,
        type: ObjectType,
        variables: Array(Variable),
        converter: Converter.Or(Null),
        color: Optional(String.Or(Null)),
        position: Optional(Unknown.Or(Null)),
        subobjects: Optional(Array(SceneObject).Or(Null)),
    })
);

// for same reason as above type is created manually instead of using Static
export type SceneObject = {
    id: number;
    type: ObjectType;
    variables: Variable[];
    converter: Converter | null;
    color?: string | null;
    position?: unknown | null;
    subobjects?: SceneObject[] | null;
};

export const sanitizeSceneObject = (s: SceneObject): SceneObject => {
    const result = {
        id: s.id,
        type: s.type,
        variables: sanitizeVariables(s.variables),
        converter: sanitizeConverter(s.converter),
    } as SceneObject;

    if (s.color) result.color = s.color;
    if (s.position) result.position = s.position;
    if (s.subobjects) result.subobjects = s.subobjects.map(sanitizeSceneObject);

    return result;
};
