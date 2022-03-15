import { TemplateField } from "./template-field";
import { TemplateTable } from "./template-table";

export class Template {
    public Id: number = -1;
    public Name: string = "Новый шаблон";
    public AuthorId: number = -1;
    public AuthorName: string = "неизвестно";
    public UpdateDate: Date = new Date();
    public Depricated: boolean = false;
    public TemplateType: string = "без типа";

    public TemplateField: TemplateField[] = [];
    public TemplateTable: TemplateTable[] = [];
}