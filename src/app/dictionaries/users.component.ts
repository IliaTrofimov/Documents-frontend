import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UsersService } from '../services/users.service';


@Component({
  selector: 'users-types-list',
  templateUrl: './users.component.html',
  providers: [UsersService]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  newUser: User = new User(-1, "", "", "");
  selection: number = 0;


  constructor(private usersSvc: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.usersSvc.getUsers().subscribe({
      next: users => this.users = users,
      error: err => {
        this.router.navigate(['error'], { queryParams: {
          "title": "Не удалось загрузить список пользователей", 
          "error": err.error
        }});
      }
    });
  }
  
  editUser(user: User){
    this.usersSvc.updateUser(user).subscribe();
    this.selection = 0;
  }

  addUser(){
    this.usersSvc.createUser(this.newUser).subscribe({
      next: id => this.users.push(new User(id, this.newUser.Firstname, this.newUser.Lastname, this.newUser.Fathersname))
    });
    this.newUser = new User(-1, "", "", "");
  }

  removeType(id: number) {
    this.selection = 0;
    this.usersSvc.deleteUser(id).subscribe(() => 
      this.users = this.users.filter(user => user.Id !== id)
    );
  }
}
