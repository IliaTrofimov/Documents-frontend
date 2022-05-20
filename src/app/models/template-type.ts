import { Position } from "./position";

export class TemplateType {
    public SignersPositions: Position[] = [];

    constructor(public Id: number, public Name: string) { }
}
