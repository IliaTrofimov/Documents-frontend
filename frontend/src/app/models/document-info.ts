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
