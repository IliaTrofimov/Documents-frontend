import { User } from "./user";

export class Signatory {
    public Id: number = -1;
    public Initiator: User = new User(-1, "", "");
    public InitiatorShortname: string = "неизвестно";  
    public User: User = new User(-1, "", "");;
    public SignerPositionId: number = -1;
    public DocumentName: string = "";
    public SignerShortname: string = "неизвестно";

    constructor(public UserId: number, 
        public DocumentId: number, 
        public InitiatorId: number, 
        public Signed: boolean = false) { }
}
