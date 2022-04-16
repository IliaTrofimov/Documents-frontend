import { switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { UsersService } from '../../services/users.service';
import { DocumentsService } from '../../services/documents.service';
import { User } from '../../models/user';
import { AppConfig } from 'src/app/app.config';



@Component({
  selector: 'app-document-view',
  templateUrl: './user-view.component.html',
  providers: [UsersService]
})
export class UserViewComponent implements OnInit {

  public user: User = new User(-1, "", "Не авторизован");
  public documentsColumns = ['Name', 'AuthorName', 'UpdateDate', 'ExpireDate', 'Actions'];
  public templatesColumns = ['Name', 'AuthorName', 'UpdateDate', 'Depricated', 'Actions'];
  public signatoriesColumns = ['Document', 'User', 'Actions'];

  public signatoriesJson = "пусто";
  public templatesJson = "пусто";
  public documentsJson = "пусто";

  private id: number = -1;


  constructor(private config: AppConfig,
    private route: ActivatedRoute,
    private router: Router,
    private usersSvc: UsersService) { }

  ngOnInit(){
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.config.auth().subscribe(usr => {
      if (usr){
        this.usersSvc.getUser(usr.Id).subscribe({
          next: fullUsr => {
            this.user = fullUsr; 
            this.documentsJson = JSON.stringify(this.user.Document, null, 2);
            this.templatesJson = JSON.stringify(this.user.Template, null, 2);
            this.signatoriesJson = JSON.stringify(this.user.Sign, null, 2); 
            console.log(JSON.stringify(this.user, null, 2))
          },
        })
      } 
    })
    
  }

  
}
