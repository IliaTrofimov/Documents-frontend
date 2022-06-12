import { Position } from "./position";

export interface ITemplateTypePosition{
    Position?: Position;
    TemplateTypeId: number;
    Id: number;
}

export class TemplateType {
    public Positions: Position[] = [];

    constructor(public Id: number, public Name: string) { }
}
