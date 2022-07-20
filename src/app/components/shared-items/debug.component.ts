import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../configurations/app.config';


/** Окно с информацией о сервере */
@Component({
  selector: 'debug',
  styleUrls: ['styles.css'],
  template: `
    <small *ngIf="!prod" class="debug-box">
      api url <a target="_blank" rel="noopener noreferrer" href='{{url}}'>{{url}}</a><br>
      {{startUp}}<br>
      {{userInfo}}
    </small>
  `,
})
export class DebugComponent implements OnInit {
  startUp: string = "started at ";
  url: string = "";
  prod: boolean = false;
  userInfo: string = "";

  constructor(private config: AppConfig){}

  ngOnInit(){
    this.prod = this.config.config.Production;
    this.url = this.config.apiUrl;
    this.config.serverTest().subscribe(data => {
      if (!data) {
        this.startUp = "not connected";
        return;
      }
      
      this.startUp = data.StartupTime ? data.StartupTime : "unknown";
      if (data.StartupTime){
        this.config.currentUser().subscribe(data => {
          this.userInfo += data.Name ? `user '${data.Name}'` : "";
          this.userInfo += data.AuthType ? ` auth-type '${data.AuthType}'` : "";
          if (!this.userInfo) this.userInfo = "unauthenticated";
        });
      }
      
    });
  }
}
