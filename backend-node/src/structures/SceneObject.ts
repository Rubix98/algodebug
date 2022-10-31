import { Converter } from "../models/Converter";
import { Mark } from "./Mark";
import { Type } from "./Type";

export class SceneObject {
    constructor (
        public id: number,
        public type: Type,
        public variable: Mark,
        public converter: Converter,
        public color: string,
        public subObjects: SceneObject[]
    ) {
        this.id = id;
        this.type = type;
        this.variable = variable;
        this.converter = converter;
        this.color = color;
        this.subObjects = subObjects;
    }
}
