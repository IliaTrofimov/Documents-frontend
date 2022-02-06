import { Injectable } from '@angular/core';
import { filter, map, Subject } from 'rxjs';
import { EventData } from '../models/events';

@Injectable({
    providedIn: 'root'
})
export class EventTransportService{
    private subject$ = new Subject<EventData>();
    
    constructor(){}

    emit(event: EventData){
        this.subject$.next(event);
    }

    on(name: string, action: any){
        return this.subject$.pipe(
            filter((e: EventData) => e.name === name),
            map((e: EventData) => e.data)
        ).subscribe(action);
    }
}
