import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


/** Сервис для валидации полей документа */
@Injectable({
    providedIn: 'root'
})
export class ValidationService{
    private start$: Subject<boolean> = new Subject<boolean>();
    private status$: Subject<boolean> = new Subject<boolean>();
    private validatorsCount: number = 0;
    private validated: number = 0;
    private status: boolean = true;
    
    constructor(){}

    /** Документ вызывает этот метод для запуска валидации, поля,
    *   учавствующие в процессе, получат уведомление и начнут проверку данных. 
    *   @returns Subject<boolean> - передаёт результаты валидации, 
    *   если некотрое поле не прошло валидацию, будет сгенерирована ошибка. Как только все поля проверены будет передано complete().
    */
    start(){
        this.status$ = new Subject<boolean>();
        this.validated = 0;
        this.status = true;
        this.start$.next(true);
        return this.status$;
    }

    /** Поле вызывает данный метод после завершения проверки. 
    * Если поле не прошло валидацию, будет сгенерирована ошибка. 
    * Как только все поля проверены в документ будет передано complete().
    * @param receivedStatus - результат проверки
    */
    validate(receivedStatus: boolean){
        this.validated++;
        this.status = this.status && receivedStatus;
        
        if (!this.status)
            this.status$.error("fail");     
        else if (this.validatorsCount == this.validated)
            this.status$.complete();          
    }

    isValidationSuccess(){
        return this.status;
    }

    getValidators(){
        return this.validatorsCount;
    }

    getValidated(){
        return this.validated;
    }


    /** Поля документы должны подписываться на уведомления о начале валидации здесь.
    *   @param action - функция вида () -> void, которая будет выполняться при получении уведомления. 
    */
    on(action: any){
        this.validatorsCount++;
        return this.start$.subscribe(() => this.validate(action()));
    }
}
