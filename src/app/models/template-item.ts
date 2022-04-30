export interface ITemplateItem{
    Id: number;
    Name: string;
    Order: number;
    TemplateId: number;

    readonly IsTable: boolean;
}