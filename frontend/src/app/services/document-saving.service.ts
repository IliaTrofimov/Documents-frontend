import { Injectable } from '@angular/core';
import { filter, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DocumentSavingService{
    private subject$ = new Subject<boolean>();
    
    constructor(){}

    startSaving(){
        this.subject$.next(true);
    }

    stopSaving(){
        this.subject$.next(false);
    }

    onSaving(action: any){
        return this.subject$.pipe(
            filter((status: boolean) => status)
        ).subscribe(action);
    }
    
}