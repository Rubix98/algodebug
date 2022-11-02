import { LabelValue } from "./LabelValue";

export class DialogData {
    constructor (
        public label: string = "",
        public properties: LabelValue[] = [],
    ) {
        this.label = label;
        this.properties = properties;  
    }
}
