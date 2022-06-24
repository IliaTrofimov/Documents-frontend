export class Signatory {
    public Firstname: string = "";
    public Lastname: string = "";
    public Fathersname: string = "";
    public SignerPositionId: number = -1;
    public DocumentName: string = "";
    public InitiatorShortname: string = "";

    constructor(public UserId: number, 
        public DocumentId: number, 
        public InitiatorId: number, 
        public Signed: boolean = false) { }
}
