import { TemplateRow } from "./template-row";

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