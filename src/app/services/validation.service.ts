import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


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

    start(){
        console.clear();
        this.status$ = new Subject<boolean>();
        this.validated = 0;
        this.status = true;
        this.start$.next(true);
        return this.status$;
    }

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

    on(action: any){
        this.validatorsCount++;
        return this.start$.subscribe(() => this.validate(action()));
    }
}
