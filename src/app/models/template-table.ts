import { TemplateField } from "./template-field";
import { ITemplateItem } from "./template-item";

export class TemplateTable implements ITemplateItem{
    public TemplateFields: TemplateField[] = [];
    public readonly IsTable = true;

    constructor(public TemplateId: number = -1,
        public Name: string = "",
        public Rows: number = 1,
        public Order: number = 0,
        public Id: number = -1){ }

}