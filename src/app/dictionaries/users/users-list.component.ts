import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Permission, PermissionFlag } from 'src/app/models/permission';
import { Position } from 'src/app/models/position';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
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
  currentUserId: number = -1;
  displayedColumns = ['UserName', 'Email', 'Position', 'Permissions', 'Edit'];

  @Input() page: number = 0;
  @Input() pageSize: number = 20;
  @Input() positionId: number = -1;
  @Input() maxPages: number = 0;
  totalElements: number = 0;

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
    return user.Lastname != "" && user.Firstname != "" && user.PositionId != -1 && 
      user.Email.match("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}");
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
    private authSvc: AuthService) { }

  ngOnInit(): void {
    const query = {
      "page": this.page, 
      "pageSize": this.pageSize, 
      "positionId":  this.positionId, 
    };
    this.authSvc.current().subscribe(user => this.currentUserId = user.Id);
    this.userSvc.count(query).subscribe(count => this.maxPages = Math.floor((this.totalElements = count) / this.pageSize));
    this.userSvc.getUsers(query).subscribe(users => this.users = users);
    this.positionsSvc.getPositions().subscribe(positions => this.positions = positions);
  }

  nextPage(delta: number){
    this.page += delta;
    this.ngOnInit();
  }

  addUser(){
    this.selected = new User(-1, "", "");
    const dialogRef = this.dialog.open(NewUserDialog, {
      data: {user: new User(-1, "", "", ""), positions: this.positions}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.alertSvc.info("Пользователь создан", {keepAfterRouteChange: true});
        location.reload();
      }
    });
  }

  editUser(user: User){
    if (!this.isValid(user)){
      this.alertSvc.error("Недопустимые данные. Проверьте поля");
      return;
    }

    this.userSvc.updateUser(user).subscribe((_user: User) => {
      this.alertSvc.info("Пользователь обновлён", {closeTime: 5000, single: true});
      this.selected = new User(-1, "", "");
      user.Position = _user.Position;
    })
  }

  removeUser(id: number) {
    this.selected = new User(-1, "", "");
    this.userSvc.deleteUser(id).subscribe(() => {
      this.alertSvc.info("Пользователь удалён", {closeTime: 5000, single: true});
      this.users = this.users?.filter(user => user.Id !== id)
    });
  }

  beginEdit(user: User){
    this.selected.Id = user.Id;
    this.selected.Lastname = user.Lastname;
    this.selected.Firstname = user.Firstname;
    this.selected.Fathersname = user.Fathersname;
    this.selected.PositionId = user.PositionId;
    this.selected.Permissions = user.Permissions;
    this.selected.Email = user.Email;
  }

  reset(user: User){
    user.Lastname = this.selected.Lastname;
    user.Firstname = this.selected.Firstname;
    user.Fathersname = this.selected.Fathersname;
    user.Permissions = this.selected.Permissions;
    user.PositionId = this.selected.PositionId;
    user.Email = this.selected.Email;
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

  changeUser(user: User){
    this.authSvc.changeUser(user.Id).subscribe(user => {
      this.currentUserId = user.Id;
      this.alertSvc.info(`Текущий пользователь: ${user.Lastname} ${user.Firstname[0]}.` + (user.Fathersname ? `${user.Fathersname[0]}.` : ''));
    });
  }
}
