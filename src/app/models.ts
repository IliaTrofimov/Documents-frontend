export enum RestrictionTypes{
    None, Only, Except, Registry
}

export class InputField {
    readonly _class: string = "InputField";

    constructor(public name: string, public restrictions: string = "", public restrictType: RestrictionTypes = 0) {}
}

export class TableField {
    readonly _class: string = "TableField";

    constructor(public name: string, 
        public columns: InputField[],
        public rows: number = 1) { }
}

export class DocTemplate {
    public updateDate: Date = new Date();

    constructor(public id: number,
        public name: string,
        public fields: (InputField | TableField)[] = [],
        public author: string = "Неизвестно",
        public type: number = 0) { }
}

export class TemplateType{
    constructor(public id: number, public name: string) {}
}


export enum DocTypes {
    InUse, InWork, Old, Signing
}

export class DocumentInfo {
    public updateDate: Date = new Date();

    constructor(public id: number,
        public name: string,
        public templateId: number, 
        public registryId?: number,
        public author: string = "Неизвестно",
        public type: DocTypes = DocTypes.InWork,
        public expireDate?: Date) {
        
        if(!this.expireDate)
            this.expireDate = new Date(this.updateDate.getFullYear() + 1, 
                this.updateDate.getMonth(), 
                this.updateDate.getDay());
    }
}

export class DocumentData {
    constructor(public id: number, public data: Array<string | string[][]> = []) { }
}