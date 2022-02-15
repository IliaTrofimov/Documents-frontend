export enum RestrictionTypes{
    None, Only, Except, Registry
}
export enum InputType{
    Text, Date, Number, Registry
}
export enum TemplateField{
    InputField, TableField
}


export interface TemplateRow {
    id: number;
    name: string;
    readonly type: TemplateField;
}


export class InputField implements TemplateRow{
    public name: string;
    public restrictions: string;
    public required: boolean;
    public restrictionType: RestrictionTypes;
    public dataType: InputType;
    public id: number;

    constructor({ name, id = 0, required = false, restrictions = "", restrictionType = 0, dataType = 0 }: { 
        name: string; 
        id?: number; 
        required?: boolean; 
        restrictions?: string; 
        restrictionType?: RestrictionTypes; 
        dataType?: InputType; 
    }) { 
        this.name = name;
        this.restrictionType = restrictionType
        this.id = id;
        this.required = required;
        this.restrictions = restrictions;
        this.dataType = dataType;
    }
    
    readonly type = TemplateField.InputField;
}

export class TableField implements TemplateRow {
    public name: string;
    public columns: InputField[];
    public rows: number;
    public id: number;

    constructor({ name, columns = [], rows = 1, id = 0 }: { 
        name: string; columns?: InputField[]; rows?: number; id?: number; 
    }) {
        this.name = name;
        this.id = id;
        this.rows = rows;
        this.columns = columns;
    }

    readonly type = TemplateField.TableField;
}

export class DocTemplate {
    public updateDate: Date = new Date();
    public authorName?: string;
    public depricated: number = 0;

    constructor(public id: number,
        public name: string,
        public fields: TemplateRow[] = [],
        public author: number = 0,
        public type: number = 0) { }      
}

export class TemplateType{
    constructor(public id: number, public name: string) {}
}
