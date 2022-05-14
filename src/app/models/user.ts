import { Signatory } from "./signatory";
import { Template } from "./template";
import { Document } from "./document";
import { Position } from "./position";

export class User {
    public Templates: Template[] = [];
    public Signs: Signatory[] = [];
    public Documents: Document[] = [];
    public Permissions: number = 0;
    public Position: Position = new Position(-1, "нет должности");
    public PositionId: number = -1;

    constructor(public Id: number, 
        public Firstname: string,
        public Lastname: string,
        public Fathersname?: string) { }

    getShortName(){
        return `${this.Firstname} ${this.Lastname}`;
    }
}