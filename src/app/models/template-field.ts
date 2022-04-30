import { RestrictionTypes, InputType } from "./template-enums";
import { ITemplateItem } from "./template-item";

export class TemplateField implements ITemplateItem {
    public Id: number = -1;
    public Restriction: string = "";
    public RestrictionType: RestrictionTypes = RestrictionTypes.None;
    public Required: boolean = false;
    public DataType: InputType = InputType.Text;
    public readonly IsTable = false;

    constructor(public Name: string = "", 
        public Order: number = 0, 
        public TemplateId: number = -1,
        public TemplateTableId?: number){
    }
}