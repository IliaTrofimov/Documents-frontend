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
    constructor(public id: number, public fields: DocumentDataItem[] = [], 
        public tables: DocumentDataTable[] = []) { }
}
