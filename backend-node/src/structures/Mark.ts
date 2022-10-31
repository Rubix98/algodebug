import { Converter } from "../models/Converter";

export class Mark {
    constructor (
        public start: number,
        public end: number,
        public name: string,
        public type: string,
        public converter: Converter
    ) {
        this.start = start;
        this.end = end;
        this.name = name;
        this.type = type;
        this.converter = converter;
    }
}
