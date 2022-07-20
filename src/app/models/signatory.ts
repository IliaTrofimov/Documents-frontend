import { User } from "./user";

export class Signatory {
    public Id: number = -1;
    public Initiator: User = new User("", "");
    public InitiatorShortname: string = "неизвестно";  
    public PositionName: string = "неизвестно";  
    public SignerPositionId: number = -1;
    public DocumentName: string = "";
    public SignerShortname: string = "не назначен";

    constructor(public UserCWID: number, 
        public DocumentId: string, 
        public InitiatorCWID: string, 
        public Signed: boolean = false) { }
}
