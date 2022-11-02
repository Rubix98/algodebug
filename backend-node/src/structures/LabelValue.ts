export class LabelValue {
    constructor (
        public label: string = "",
        public value: string = "",
        public fieldType: string | null = null
    ) {
        this.label = label;
        this.value = value;
        this.fieldType = fieldType;
    }
}
