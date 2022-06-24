import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../configurations/app.config';

@Component({
  selector: 'debug',
  template: `
    <small *ngIf="!prod" style="position:absolute;top:0;right: 0;font-family:Consolas;line-height:0.8;">
      api url <a target="_blank" rel="noopener noreferrer" href='{{url}}'>{{url}}</a><br>
      {{build}}<br>
      {{userInfo}}
    </small>
  `,
})
export class DebugComponent implements OnInit {
  build: string = "not connected";
  url: string = "";
  prod: boolean = false;
  userInfo: string = "";

  constructor(private config: AppConfig){}

  ngOnInit(){
    this.prod = this.config.config.Production;
    this.url = this.config.apiUrl;
    this.config.serverTest().subscribe(data => {
      this.build = data.BuildDate ? `build ${data.BuildDate}` : "not connected";
      this.config.currentUser().subscribe(data => {
        this.userInfo += data.Name ? `user '${data.Name}'` : "";
        this.userInfo += data.AuthType ? ` auth-type '${data.AuthType}'` : "";
      });
    });
  }
}
