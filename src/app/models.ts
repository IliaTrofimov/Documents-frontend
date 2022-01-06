export class InputField {
    readonly _class: string = "InputField";

    constructor(public name: string, public restrictions: string = "") {}
}

export class TableField {
    readonly _class: string = "TableField";

    constructor(public name: string, 
        public columns: InputField[],
        public rows: number = 1) { }
}

export class DocTemplate {
    constructor(public id: number,
        public name: string,
        public fields: (InputField | TableField)[] = [],
        public author: string = "",
        public type: number = 0,
        public updateDate: Date = new Date()) { }
}