import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Permission, PermissionFlag } from 'src/app/models/permission';
import { Position } from 'src/app/models/position';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'new-user-dialog',
  templateUrl: 'new-user-dialog.component.html',
  providers: [UsersService],
})
export class NewUserDialog {
  Flag = PermissionFlag;
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
    private userSvc: UsersService) { }

  ok(){
    this.userSvc.createUser(this.data.user).subscribe({
      next: id => {
        this.data.user.Id = id;
        this.dialogRef.close(this.data.user);
      },
      error: err => this.dialogRef.close(err)
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