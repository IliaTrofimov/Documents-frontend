import { Signatory } from "./signatory";
import { Template } from "./template";
import { Document } from "./document";

export class User {
    public Template: Template[] = [];
    public Sign: Signatory[] = [];
    public Document: Document[] = [];

    constructor(public Id: number, 
        public Firstname: string,
        public Lastname: string,
        public Fathersname?: string) { }

    getShortName(){
        return `${this.Firstname} ${this.Lastname}`;
    }
}