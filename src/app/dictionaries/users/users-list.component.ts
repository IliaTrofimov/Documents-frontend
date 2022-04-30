import { Component, OnInit } from '@angular/core';
import  {MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { NewUserDialog } from './new-users-dialog.component';


@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  providers: [UsersService]
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  selected = -1;
  displayedColumns = ['Id', 'Lastname', 'Firstname', 'Fathersname', 'Permissions', 'Group', 'Edit'];

  constructor(private userSvc: UsersService, 
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userSvc.getUsers().subscribe({
      next: users => this.users = users,
      error: err => {
        this.router.navigate(['error'], { queryParams: {
          "title": "Не удалось загрузить список пользователей", 
          "error": JSON.stringify(err.error, null, 2)
        }});
      }
    });
  }

  addUser(){
    this.selected = -1;
    const dialogRef = this.dialog.open(NewUserDialog);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userSvc.updateUser(result).subscribe({
          next: () => {
            console.log('ok'); 
            this.users.push(result);
          },
          error: err => console.log(JSON.stringify(err, null, 2))
        })
      }
    });
  }

  editUser(user: User){
    this.userSvc.updateUser(user).subscribe({
      next: () => {
        console.log('ok'); 
        this.selected = -1;
      },
      error: err => console.log(JSON.stringify(err, null, 2))
    })
  }


  removeUser(id: number) {
    this.selected = -1;
    this.userSvc.deleteUser(id).subscribe({
      next: () => {
        console.log('ok'); 
        this.users = this.users.filter(user => user.Id !== id)
      },
      error: err => console.log(JSON.stringify(err, null, 2))
    });
  }
}
