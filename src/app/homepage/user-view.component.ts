import { ChangeDetectorRef, Component, OnInit} from '@angular/core';

import { UsersService } from '../services/users.service';
import { User } from '../models/user';
import { Permission } from '../models/permission';
import { SignatoriesService } from '../services/signatories.service';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { AppConfig } from '../configurations/app.config';


enum Pages{
  Documents, Templates, Signs, MySigns
}

@Component({
  selector: 'app-document-view',
  templateUrl: './user-view.component.html',
  providers: [UsersService, SignatoriesService]
})
export class UserViewComponent implements OnInit {
  public user?: User;
  public permissions: string[] = [];
  public signatoriesColums: string[] = ["Document", "User", "Date", "Edit"];

  public Pages = Pages;
  public currentPage: Pages = Pages.Documents;

  constructor(private config: AppConfig,
    private alertSvc: AlertService,
    private usersSvc: UsersService,
    private authSvc: AuthService) { }

  ngOnInit(){
    this.authSvc.current().subscribe(current => {
      this.usersSvc.getUser(current.Id).subscribe(user => {this.user = user; console.log(user)});
      this.permissions = Permission.toArray(current.Permissions);
    })
  }
  
}
