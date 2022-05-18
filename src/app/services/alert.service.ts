import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType } from '../models/alert';


@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<Alert>();
    private defaultId = 'root';

    onAlert(id = this.defaultId): Observable<Alert> {
      return this.subject.asObservable().pipe(filter(x => x && x.id === id));
    }

    success(title: string, options?: any) {
      this.alert(new Alert({ ...options, type: AlertType.Success, title: title }));
    }

    error(title: string, options?: any) {
      this.alert(new Alert({ ...options, type: AlertType.Error, title: title }));
    }

    info(title: string, options?: any) {
      this.alert(new Alert({ ...options, type: AlertType.Info, title: title }));
    }

    warn(title: string, options?: any) {
      this.alert(new Alert({ ...options, type: AlertType.Warning, title: title }));
    }

    alert(alert: Alert) {
      alert.id = alert.id || this.defaultId;
      this.subject.next(alert);
    }

    clear(id = this.defaultId) {
      this.subject.next(new Alert({ id }));
    }
}