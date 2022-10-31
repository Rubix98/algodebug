import { ObjectId } from "mongodb";

export class Converter {
    constructor(
        public title: string, 
        public language: string, 
        public type: string, 
        public code: string,
        
        public id?: ObjectId,
    ) {
        this.title = title;
        this.language = language;
        this.type = type;
        this.code = code;
        this.id = id;
    };
}
