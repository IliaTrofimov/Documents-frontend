import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType } from '../models/alert';


@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<Alert>();
    private defaultRoot = 'root';
    private currentId: number = -1;

    onAlert(root = this.defaultRoot): Observable<Alert> {
      return this.subject.asObservable().pipe(filter(x => x && x.root === root));
    }

    success(title: string, options?: any) {
      this.alert(new Alert({ ...options, type: AlertType.Success, title: title, closeTime: 5000 }));
    }

    error(title: string, options?: any) {
      this.alert(new Alert({ ...options, type: AlertType.Error, title: title }));
    }

    info(title: string, options?: any) {
      this.alert(new Alert({ ...options, type: AlertType.Info, title: title, single: true, closeTime: 5000 }));
    }

    warn(title: string, options?: any) {
      this.alert(new Alert({ ...options, type: AlertType.Warning, title: title }));
    }

    select(id: number = -1){
      this.currentId = id;
    }

    getSelected(){
      return this.currentId;
    }

    alert(alert: Alert) {
      alert.id = ++this.currentId;
      alert.root = alert.root || this.defaultRoot;
      this.subject.next(alert);
    }

    clear(root = this.defaultRoot) {
      this.subject.next(new Alert({ root: root }));
    }
}