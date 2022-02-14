import { DocTemplate } from "./template-models";

export enum DocTypes {
    InWork, Signing, InUse, Old
}

export class DocumentInfo {
    public updateDate: Date = new Date();
    public authorName?: string;

    constructor(public id: number,
        public name: string,
        public templateId: number, 
        public registryId?: number,
        public author: number = 0,
        public type: DocTypes = DocTypes.InWork,
        public previousDoc: number = -1,
        public expireDate?: Date ) {}
}

export class DocumentDataItem {
    constructor(public id: number, public value: string = "") {}
}

export class DocumentDataTable {
    constructor(public id: number, public columns: Array<{id: number, values: string[]}> = []) {}

    findColumn(id: number){
        return this.columns.find(c => c.id == id);
    }
}

export class DocumentData {
    constructor(public id: number, public fields: DocumentDataItem[] = [], public tables: DocumentDataTable[] = []) { }
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
