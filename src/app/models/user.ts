import { Sign } from "./sign";
import { Template } from "./template";

export class User {
    public Template: Template[] = [];
    public Sign: Sign[] = [];
    public Document: Document[] = [];

    constructor(public Id: number, 
        public Firstname: string,
        public Lastname: string,
        public Fathersname?: string) { }

    get shortName(){
        return `${this.Firstname} ${this.Lastname}`;
    }
}