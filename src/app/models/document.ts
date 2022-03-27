import { Sign } from "./sign";
import { Template } from "./template"
import { DocumentDataItem } from "./document-data-item";


export enum DocumentStatus {
    InWork, Signing, InUse, Old
}

export class Document {
    public Id: number = -1;
    public Name: string = "Новый документ";
    public TemplateId: number = -1;
    public Type: DocumentStatus = DocumentStatus.InWork;
    public UpdateDate: Date = new Date();
    public ExpireDate?: Date;
    public AuthorId: number = -1;
    public AuthorName: string = "неизвестно";

    public Template?: Template;
    public DocumentDataItem: DocumentDataItem[] = [];
    public Sign: Sign[] = [];

    public RegistryId: number = -1;
    public PreviousDoc: number = -1;
}
