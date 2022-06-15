import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Router} from '@angular/router';

import { UsersService } from '../services/users.service';
import { User } from '../models/user';
import { AppConfig } from 'src/app/app.config';
import { Permission } from '../models/permission';
import { SignatoriesService } from '../services/signatories.service';
import { Signatory } from '../models/signatory';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-document-view',
  templateUrl: './user-view.component.html',
  providers: [UsersService, SignatoriesService]
})
export class UserViewComponent implements OnInit {
  public user?: User;
  public permissions: string[] = [];
  public signatoriesColums: string[] = ["Document", "User", "Date", "Edit"];


  constructor(private config: AppConfig,
    private alertSvc: AlertService,
    private router: Router,
    private usersSvc: UsersService,
    private signsService: SignatoriesService,
    private authSvc: AuthService,
    private detector: ChangeDetectorRef) { }

  ngOnInit(){
    this.authSvc.current().subscribe(current => {
      this.usersSvc.getUser(current.Id).subscribe(user => {this.user = user; console.log(user)});
      this.permissions = Permission.toArray(current.Permissions);
    })
  }

  selectTab(index: number){
    this.detector.detectChanges();
  }

  sign(s: Signatory){
    s.Signed = !s.Signed;
    this.signsService.updateSign(s).subscribe(() => this.alertSvc.info(s.Signed ? "Документ подписан" : "Подпись отозвана"));
  }
  
}
