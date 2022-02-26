import { DocumentData } from "./document-data";
import { DocumentInfo } from "./document-info";
import { DocTemplate } from "./template";
import { User } from "./user";

export interface Merged{
    info: DocumentInfo;
    data?: DocumentData;
    template?: DocTemplate;
    user?: User;
}