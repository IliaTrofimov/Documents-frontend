import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import  {MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Permission, PermissionFlag } from 'src/app/models/permission';
import { Position } from 'src/app/models/position';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert.service';
import { PositionsService } from 'src/app/services/positions.service';
import { UsersService } from 'src/app/services/users.service';
import { NewUserDialog } from './new-users-dialog.component';


@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  providers: [UsersService, PositionsService],
  styleUrls: ['../styles.css']
})
export class UsersListComponent implements OnInit {
  users?: User[];
  tempUser?: User;
  positions?: Position[];
  selected = -1;
  displayedColumns = ['UserName', 'Position', 'Permissions', 'Edit'];

  Flag = PermissionFlag;
  has(user: User, flag: PermissionFlag){
    return Permission.has(user.Permissions, flag);
  }

  permissionString(user: User){
    return Permission.toString(user.Permissions);
  }

  permissionArray(user: User){
    return Permission.toArray(user.Permissions);
  }

  allPermissions = [
    PermissionFlag.ReadDocuments,
    PermissionFlag.WriteReadDocuments,
    PermissionFlag.ReadTemplates,
    PermissionFlag.WriteReadTemplates,
    PermissionFlag.EditDictionares
  ]
  
  constructor(private userSvc: UsersService, 
    private positionsSvc: PositionsService,
    private router: Router,
    public dialog: MatDialog,
    private alertSvc: AlertService) { }

  ngOnInit(): void {
    this.userSvc.getUsers().subscribe({
      next: users => this.users = users,
      error: err => this.alertSvc.error("Не удалось загрузить данные")
    });
    this.positionsSvc.getPositions().subscribe({
      next: positions => this.positions = positions,
      error: err => this.alertSvc.error("Не удалось загрузить данные")
    });
  }

  addUser(){
    this.selected = -1;
    const dialogRef = this.dialog.open(NewUserDialog, {
      data: {user: new User(-1, "", "", ""), positions: this.positions}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userSvc.createUser(result).subscribe({
          next: id => {
            this.alertSvc.info("Пользователь создан", {message: "Обновите страницу", autoClose: true, single: true});
            result.Id = id;
            this.users?.push(result);
          },
          error: err => this.alertSvc.error("Не удалось создать пользователя", {message: JSON.stringify(err, null, 2)})
        })
      }
    });
  }

  editUser(user: User){
    this.userSvc.updateUser(user).subscribe({
      next: (_user: User) => {
        this.alertSvc.info("Пользователь обновлён", {autoClose: true, single: true});
        this.selected = -1;
        user.Position = _user.Position;
      },
      error: err => this.alertSvc.error("Не удалось изменить пользователя", {message: JSON.stringify(err, null, 2)})
    })
  }

  removeUser(id: number) {
    this.selected = -1;
    this.userSvc.deleteUser(id).subscribe({
      next: () => {
        this.alertSvc.info("Пользователь удалён", {autoClose: true, single: true});
        this.users = this.users?.filter(user => user.Id !== id)
      },
      error: err => this.alertSvc.error("Не удалось удалить пользователя", {message: JSON.stringify(err, null, 2)})
    });
  }

  togglePermission(user: User, flag: PermissionFlag){
    if(!this.has(user, flag)){
      user.Permissions = user.Permissions ^ (+flag);
    }
    else{
      user.Permissions = user.Permissions & ~(+flag);
    }
  }
}
