import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ValidationService{
    private start$: Subject<boolean> = new Subject<boolean>();
    private status$: Subject<boolean> = new Subject<boolean>();
    
    constructor(){}


    start(){
        setTimeout(() => this.start$.next(true), 10);
        return this.status$;
    }

    validate(receivedStatus: boolean){
        if(!receivedStatus){
            this.status$.complete();
        }
    }

    on(action: any){
        return this.start$.subscribe(() => this.validate(action()));
    }
}
