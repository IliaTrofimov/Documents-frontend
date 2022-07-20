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
    public Email: string = ""; 
    public CWID: string = "";
    public LeadingSubgroup: string = "";
    public ExternalCompany: string = "";
    public OrgName: string = "";
    public CompanyCode: string = "";
    public ManagerCWID?: number;
    public Manager?: User;
    public EmployeeType: string = "";

    constructor(public Firstname: string,
        public Lastname: string,
        public Fathersname?: string,
        public PositionId: number = -1) { }
}