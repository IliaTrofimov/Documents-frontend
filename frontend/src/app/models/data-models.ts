export enum RestrictionTypes{
    None, Only, Except, Registry
}

export enum InputFieldType{
    Text, Date, Number, Registry
}

export class InputField {
    readonly _class: string = "InputField";

    constructor(public name: string, 
        public restrictions: string = "", 
        public required: boolean = true,
        public restrictionType: RestrictionTypes = RestrictionTypes.None,
        public dataType: InputFieldType = InputFieldType.Text,
        public order: number = 0) { }
}

export class TableField {
    readonly _class: string = "TableField";

    constructor(public name: string, 
        public columns: InputField[] = [],
        public rows: number = 1,
        public order: number = 0) { }
}

export class DocTemplate {
    public updateDate: Date = new Date();

    constructor(public id: number,
        public name: string,
        public fields: (InputField | TableField)[] = [],
        public author: number = 0,
        public type: number = 0) { }
}

export class TemplateType{
    constructor(public id: number, public name: string) {}
}


export enum DocTypes {
    InWork, Signing, InUse, Old
}

export class DocumentInfo {
    public updateDate: Date = new Date();

    constructor(public id: number,
        public name: string,
        public templateId: number, 
        public registryId?: number,
        public author: number = 0,
        public type: DocTypes = DocTypes.InWork,
        public previousDoc: number = -1,
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

export class User {
    constructor(public id: number, public name: string) { }
}

export class Signatory {
    constructor(public userId: number, public documentId: number) { }
}

export interface Merged{
    info: DocumentInfo;
    data?: DocumentData;
    template?: DocTemplate;
    user?: User;
}
