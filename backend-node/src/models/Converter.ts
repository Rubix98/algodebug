import { ObjectId } from "mongodb";
import { DialogData } from "../structures/DialogData";
import { LabelValue } from "../structures/LabelValue";

export class Converter {

    public dialogData: DialogData

    constructor(
        public title: string = "", 
        public language: string = "", 
        public type: string = "", 
        public code: string = "",

        public id?: ObjectId,
    ) {
        this.title = title;
        this.language = language;
        this.type = type;
        this.code = code;
        this.dialogData = new DialogData(
            "", // title ???
            [
                new LabelValue("Nazwa" , title),
                new LabelValue("Typ zmiennej", type),
                new LabelValue("Język programowania", language),
                new LabelValue("Kod", code, "textarea"),
            ]
        );

        this.id = id ? id : new ObjectId();
    };
}
