import { Converter } from "../models/Converter";

export class Mark {
    constructor (
        public start: number = 0,
        public end: number = 0,
        public name: string = "",
        public type: string = "",
        public converter: Converter = new Converter(),
    ) {
        this.start = start;
        this.end = end;
        this.name = name;
        this.type = type;
        this.converter = converter;
    }
}
