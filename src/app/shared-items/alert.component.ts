import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Alert, AlertType } from '../models/alert';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'alert',
  styleUrls: ['styles.css'],
  template: `
  <div *ngIf="alerts.length != 0" class="sticky-top">
    <div *ngFor="let alert of alerts" class="{{cssClass(alert)}}" style="max-height: 5%;">
      <ng-container *ngIf="alert.message">
        {{alert.title}} 
        <small><a class="alert-link" *ngIf="alert.message" (click)="select(alert.id)" role="button">
          {{alert.id != getSelectedId() ? 'подробнее' : 'скрыть'}}
        </a></small><br>
        <pre *ngIf="alert.id == getSelectedId()">{{alert.message}}</pre>
      </ng-container>
      <ng-container *ngIf="!alert.message">
        {{alert.title}}
      </ng-container>
      <button class="close" (click)="removeAlert(alert)"><span aria-hidden="true">&times;</span></button>
    </div>
  </div>
  `
})
export class AlertComponent implements OnInit {
  @Input() id = 'root';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription?: Subscription;
  routeSubscription?: Subscription;

  constructor(private router: Router, 
    private alertService: AlertService, 
    private detector: ChangeDetectorRef) { 
    this.alertSubscription = this.alertService.onAlert().subscribe(alert => {
      if (!alert.title && !alert.message) {
        this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);
        return;
      }
      if (alert.single)
        this.alerts = this.alerts.filter(x => x.type != alert.type);
      
      this.alerts.push(alert);
      this.detector.detectChanges();
      console.log(`alert at ${new Date().toTimeString().split(' ', 2)[0]} '${alert.title}'`);

      if (alert.closeTime)
        setTimeout(() => this.removeAlert(alert), alert.closeTime);
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

  getSelectedId(){
    return this.alertService.getSelected();
  }

  select(id: number){
    if (id == this.alertService.getSelected())
      this.alertService.select();
    else
      this.alertService.select(id);
  }

  cssClass(alert?: Alert) {
    if (!alert) return;
    switch (alert.type){
      case AlertType.Success: return 'alert alert-dismissible fade show alert-success';
      case AlertType.Error: return 'alert alert-dismissible fade show alert-danger';
      case AlertType.Info: return 'alert alert-dismissible fade show alert-info';
      case AlertType.Warning: return'alert alert-dismissible fade show alert-warning';
    }
  }
}