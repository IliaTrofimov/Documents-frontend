import { switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { UsersService } from '../services/users.service';
import { User } from '../models/user';
import { AppConfig } from 'src/app/app.config';
import { Permission } from '../models/permission';
import { SiteErrorCodes } from '../models/site-error';



@Component({
  selector: 'app-document-view',
  templateUrl: './user-view.component.html',
  providers: [UsersService]
})
export class UserViewComponent implements OnInit {

  public user: User = new User(-1, "", "Не авторизован");
  public permissions: string[] = [];

  public documentsColumns = ['Name', 'AuthorName', 'UpdateDate', 'ExpireDate', 'Actions'];
  public templatesColumns = ['Name', 'AuthorName', 'UpdateDate', 'Depricated', 'Actions'];
  public signatoriesColumns = ['Document', 'User', 'Actions'];

  public signatoriesJson = "пусто";
  public templatesJson = "пусто";
  public documentsJson = "пусто";


  constructor(private config: AppConfig,
    private router: Router,
    private usersSvc: UsersService) { }

  ngOnInit(){
    this.usersSvc.getCurrent().subscribe({
      next: user => {
        this.user = user; 
        console.log(JSON.stringify(this.user, null, 2));
        this.permissions = Permission.toArray(this.user.Permissions);
        console.log(JSON.stringify(this.permissions, null, 2));
      },
      error: err => {
        this.router.navigate(["error"], { queryParams: {
          "status": SiteErrorCodes.Unauthorized, 
        }})
      }
    })
  }

  
}
