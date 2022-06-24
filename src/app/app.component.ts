import { Component, OnInit } from '@angular/core';
import { AppConfig } from './configurations/app.config';


@Component({
  selector: 'app-root',
  template: `
    <site-header *ngIf="active"></site-header>
    <debug></debug>
    <div *ngIf="active" class="container">
      <alert></alert>
      <router-outlet></router-outlet>
    </div>
    <site-footer *ngIf="active"></site-footer>
    <div *ngIf="!active" style="font-size:x-large"> 
      <strong>Ресурс недоступен!</strong>
      <p>{{message}}</p>
    </div>
  `,
})
export class AppComponent implements OnInit{
  public active: boolean = true;
  public message?: string;

  constructor(private config: AppConfig){}

  ngOnInit(): void {
    this.active = this.config.config.Active;
    if (!this.active)
      this.message = this.config.config.ServiceMessage; 
  }

}
