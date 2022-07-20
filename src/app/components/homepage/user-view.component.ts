import { Component, OnInit} from '@angular/core';

import { UsersService } from '../../services/users.service';
import { User } from '../../models/user';
import { PermissionFlag, Permission } from '../../models/permission';
import { SignatoriesService } from '../../services/signatories.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { AppConfig } from '../../configurations/app.config';


enum Pages{
  Documents, Templates, Signs, MySigns
}

/** Страница пдля просмотра информации о текущем пользователе: его ФИО, должность почта, его документы, шаблоны и подписи */
@Component({
  selector: 'app-document-view',
  templateUrl: './user-view.component.html',
  providers: [UsersService, SignatoriesService]
})
export class UserViewComponent implements OnInit {
  public PermissionFlag = PermissionFlag;

  public user?: User;
  public permissions: string[] = [];
  public signatoriesColums: string[] = ["Document", "User", "Date", "Edit"];

  public Pages = Pages;
  public currentPage: Pages = Pages.Documents;

  constructor(private config: AppConfig,
    private alertSvc: AlertService,
    private authSvc: AuthService) { }

  ngOnInit(){
    this.authSvc.whoami().subscribe(user => {
      this.user = user;
      this.permissions = Permission.toArray(user.Permissions);
    })
  }
  
}
