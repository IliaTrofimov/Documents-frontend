export enum SiteErrorCodes {
    Unknown = -1,
    ConnectionRefused = 0,
    Ok = 200,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    Internal = 500,
    NoConnection = 521,
    Unavaliable = 503,
    ServerTimeout = 522,
    Timeout = 524
}

export class SiteError {
    readonly Status: SiteErrorCodes;
    readonly Title: string;
    readonly Message: string;

    static readonly Ok: SiteError = new SiteError(SiteErrorCodes.Ok);
    static readonly BadRequest: SiteError = new SiteError(SiteErrorCodes.BadRequest);
    static readonly Unauthorized: SiteError = new SiteError(SiteErrorCodes.Unauthorized);
    static readonly Forbidden: SiteError = new SiteError(SiteErrorCodes.Forbidden);
    static readonly NotFound: SiteError = new SiteError(SiteErrorCodes.NotFound);
    static readonly Conflict: SiteError = new SiteError(SiteErrorCodes.Conflict);
    static readonly Internal: SiteError = new SiteError(SiteErrorCodes.Internal);
    static readonly NoConnection: SiteError = new SiteError(SiteErrorCodes.NoConnection);

    constructor(code: SiteErrorCodes = SiteErrorCodes.Unknown, public readonly Info?: string){
        this.Status = code;
        switch (+this.Status) {
            case SiteErrorCodes.Ok:
                this.Title = "Нет ошибок";
                this.Message = "Все действия завершены успешно.";
                break;
            case SiteErrorCodes.BadRequest: 
                this.Title = "Недопустимый запрос";
                this.Message = "Не удалось выполнить запрос. Возможно данные были переданы в неизвестном формате.";
                break;
            case SiteErrorCodes.Unauthorized: 
                this.Title = "Требуется авторизация";
                this.Message = "Для получения доступа к ресурсу требуется пройти авторизацию. Если у Вас не аккаунта в системе, пожалуйста, обратитесь к администратору.";
                break;
            case SiteErrorCodes.Forbidden: 
                this.Title = "Нет доступа";
                this.Message = "У вашего аккаунта нет прав для получения доступа к ресурсу.";
                break;
            case SiteErrorCodes.NotFound: 
                this.Title = "Элемент не найден";
                this.Message = "Запрашиваемый элемент не существует.";
                break;             
            case SiteErrorCodes.Conflict: 
                this.Title = "Конфликт данных";
                this.Message = "Изменение данных невозможно, так как некоторые элементы ссылаются на них.";
                break;
            case SiteErrorCodes.Internal: 
                this.Title = "Внутренняя ошибка";
                this.Message = "Выполнить действие не удалось из-за ошибки со стороны сервера.";
                break;
            case SiteErrorCodes.ConnectionRefused:
            case SiteErrorCodes.NoConnection: 
            case SiteErrorCodes.Unavaliable:
            case SiteErrorCodes.Timeout:
            case SiteErrorCodes.ServerTimeout:
                this.Title = "Нет соединения";
                this.Message = "Не удалось подключиться к серверу. Возможно у Вас отсутсвует интернет-соединение или сервер не работает.";
                break;
            default:
                this.Title = "Неизвестная ошибка";
                this.Message = "Ошибка не была распознана.";
                break;  
        }
    }

    static isCritical(code: number): boolean {
        switch(code){
            case 0:
            case SiteErrorCodes.Forbidden:
            case SiteErrorCodes.NoConnection: 
            case SiteErrorCodes.Unavaliable:
            case SiteErrorCodes.Timeout:
            case SiteErrorCodes.ServerTimeout:
            case SiteErrorCodes.Unauthorized:
                return true;
            default: 
                return false;
        }
    }
}