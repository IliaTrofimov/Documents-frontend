import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Alert, AlertType } from '../models/alert';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'alert',
  template: `
  <div *ngFor="let alert of alerts" class="{{cssClass(alert)}}">
    <button class="close" (click)="removeAlert(alert)">&times;</button>
    {{alert.message}}
  </div>
  `
})
export class AlertComponent implements OnInit {
  @Input() id = 'root';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription?: Subscription;
  routeSubscription?: Subscription;

  constructor(private router: Router, private alertService: AlertService) { 
    this.alertSubscription = this.alertService.onAlert(this.id).subscribe(alert => {
      if (!alert.message) {
        this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);
        return;
      }
      this.alerts.push(alert);
      console.log("alert: ", alert.message);
      if (alert.autoClose)
        setTimeout(() => this.removeAlert(alert), 3000);
    });
  }

  ngOnInit() {
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart)
        this.alertService.clear(this.id);
    });
  }

  ngOnDestroy() {
    this.alertSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }

  removeAlert(alert: Alert) {
    if (!this.alerts.includes(alert)) return;
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClass(alert?: Alert) {
    if (!alert) return;

    const classes = ['alert', 'alert-dismissable'];
                
    const alertTypeClass = {
      [AlertType.Success]: 'alert alert-success',
      [AlertType.Error]: 'alert alert-danger',
      [AlertType.Info]: 'alert alert-info',
      [AlertType.Warning]: 'alert alert-warning'
    }

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('fade');
    }

    return classes.join(' ');
  }
}