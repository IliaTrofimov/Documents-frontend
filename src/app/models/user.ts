import { Signatory } from "./signatory";
import { Template } from "./template";
import { Document } from "./document";

export class User {
    public Templates: Template[] = [];
    public Signs: Signatory[] = [];
    public Documents: Document[] = [];
    public Permissions: number = 0;

    constructor(public Id: number, 
        public Firstname: string,
        public Lastname: string,
        public Fathersname?: string) { }

    getShortName(){
        return `${this.Firstname} ${this.Lastname}`;
    }
}