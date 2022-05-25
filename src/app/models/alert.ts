export class Alert {
    root: string = "root";
    type: AlertType = AlertType.Success;
    title: string = "";
    message: string = "";
    closeTime?: number;
    keepAfterRouteChange: boolean = false;
    id: number = 0;
    single: boolean = false;

    constructor(init?:Partial<Alert>) {
        Object.assign(this, init);
    }
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}