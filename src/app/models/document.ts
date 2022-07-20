import { Signatory } from "./signatory";
import { Template } from "./template"
import { DocumentDataItem } from "./document-data-item";
import { User } from "./user";


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
    public AuthorCWID: string = "";
    public Author?: User;

    public Template?: Template;
    public TemplateName?: string;
    public DocumentDataItems: DocumentDataItem[] = [];
    public Sign: Signatory[] = [];

    public RegistryId: number = -1;
    public PreviousDoc: number = -1;
}
