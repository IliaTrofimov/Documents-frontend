export interface EventData{
    name: string;
    data: any;
}

export class ValidatingEvent implements EventData{
    name: string = "validate";
    data = undefined; 
}

export class SilentValidatingEvent implements EventData{
    name: string = "validate-s";
    data = undefined; 
}

export class ShowValidationErrorsEvent implements EventData{
    name: string = "validation-err";
    data = undefined; 
}
