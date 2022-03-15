export class Sign {
    public UserName: string = "";
    public DocumentName: string = "";

    constructor(public UserId: number, 
        public DocumentId: number, 
        public Signed: boolean = false) { }
}
