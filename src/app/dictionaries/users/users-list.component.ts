import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  selected: User = new User(-1, "", "");
  positions?: Position[];
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

  isValid(user: User){
    return user.Lastname != "" && user.Firstname != "" && user.PositionId != -1;
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
    private dialog: MatDialog,
    private alertSvc: AlertService,
    private router: Router,
    private detector: ChangeDetectorRef) { }

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
    this.selected = new User(-1, "", "");
    const dialogRef = this.dialog.open(NewUserDialog, {
      data: {user: new User(-1, "", "", ""), positions: this.positions}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      if (result instanceof User) {
        this.users?.push(result);
        this.alertSvc.info("Пользователь создан", {closeTime: 5000, single: true});
        this.detector.detectChanges();
      }
      else{
        this.alertSvc.error("Не удалось создать пользователя", {message: JSON.stringify(result, null, 2)})
      }
    });
  }

  editUser(user: User){
    if (!this.isValid(user)){
      this.alertSvc.error("Заполните обязательные поля");
      return;
    }

    this.userSvc.updateUser(user).subscribe({
      next: (_user: User) => {
        console.log(_user);
        this.alertSvc.info("Пользователь обновлён", {closeTime: 5000, single: true});
        this.selected = new User(-1, "", "");
        user.Position = _user.Position;
      },
      error: err => this.alertSvc.error("Не удалось изменить пользователя", {message: JSON.stringify(err, null, 2)})
    })
  }

  removeUser(id: number) {
    this.selected = new User(-1, "", "");
    this.userSvc.deleteUser(id).subscribe({
      next: () => {
        this.alertSvc.info("Пользователь удалён", {closeTime: 5000, single: true});
        this.users = this.users?.filter(user => user.Id !== id)
      },
      error: err => this.alertSvc.error("Не удалось удалить пользователя", {message: JSON.stringify(err, null, 2)})
    });
  }

  beginEdit(user: User){
    this.selected.Id = user.Id;
    this.selected.Lastname = user.Lastname;
    this.selected.Firstname = user.Firstname;
    this.selected.Fathersname = user.Fathersname;
    this.selected.PositionId = user.PositionId;
    this.selected.Permissions = user.Permissions;
  }

  reset(user: User){
    user.Lastname = this.selected.Lastname;
    user.Firstname = this.selected.Firstname;
    user.Fathersname = this.selected.Fathersname;
    user.Permissions = this.selected.Permissions;
    user.PositionId = this.selected.PositionId;
    this.selected = new User(-1, "", "");
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
