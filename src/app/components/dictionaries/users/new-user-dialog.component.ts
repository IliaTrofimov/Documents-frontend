import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Permission, PermissionFlag } from 'src/app/models/permission';
import { Position } from 'src/app/models/position';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';


/** Модальное окно для создания нового пользователя */
@Component({
  selector: 'new-user-dialog',
  templateUrl: 'new-user-dialog.component.html',
  providers: [UsersService],
})
export class NewUserDialog implements OnInit{
  Flag = PermissionFlag;
  users: User[] = [];

  has(flag: PermissionFlag){
    return Permission.has(this.data.user.Permissions, flag);
  }

  allPermissions = [
    PermissionFlag.ReadDocuments,
    PermissionFlag.WriteReadDocuments,
    PermissionFlag.ReadTemplates,
    PermissionFlag.WriteReadTemplates,
    PermissionFlag.EditDictionares
  ]
 
  constructor(private dialogRef: MatDialogRef<NewUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {user: User, positions?: Position[]},
    private userSvc: UsersService,
    private alertSvc: AlertService) { }

  ngOnInit(): void {
    this.userSvc.getUsers().subscribe(users => this.users = users);  
  }

  ok(){
    this.userSvc.createUser(this.data.user).subscribe({
      next: cwid => {
        this.data.user.CWID = cwid;
        this.dialogRef.close(this.data.user);
      },
      error: (err) => {
        if (err instanceof HttpErrorResponse && err.status == HttpStatusCode.Conflict)
          return;
        this.dialogRef.close(undefined); 
      }
    });
  }

  toggle(flag: PermissionFlag){
    if(!this.has(flag)){
      this.data.user.Permissions = this.data.user.Permissions ^ (+flag);
    }
    else{
      this.data.user.Permissions = this.data.user.Permissions & ~(+flag);
    }
  }
}