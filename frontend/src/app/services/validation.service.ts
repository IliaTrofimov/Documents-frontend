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
        console.log(`ValidationService.start()\nvalidators ${this.validatorsCount}\nvalidated ${this.validated}\nstatus ${this.isValidationSuccess()}`);
        this.start$.next(true);
        return this.status$;
    }

    validate(receivedStatus: boolean){
        this.validated++;
        this.status = this.status && receivedStatus;
        console.log(`ValidationService.validate(${receivedStatus})\nvalidators ${this.validatorsCount}\nvalidated ${this.validated}\nstatus ${this.status}`);
        
        if (!this.status){
            console.log("error")
            this.status$.error("fail");     
        }
        else if (this.validatorsCount == this.validated){
            console.log("complete")
            this.status$.complete();     
        }       
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
        console.log(`ValidationService.on(), validators ${this.validatorsCount}`);
        return this.start$.subscribe(() => this.validate(action()));
    }
}
