import { TemplateField } from "./template-field";

export class TemplateTable{
    public TemplateFields: TemplateField[] = [];

    constructor(public TemplateId: number = -1,
        public Name: string = "",
        public Rows: number = 1,
        public Order: number = 0,
        public Id: number = -1){ }

    public isTable() {
        return true;
    }
}