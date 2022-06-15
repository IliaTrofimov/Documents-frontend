import { Component, Inject, OnInit} from '@angular/core';
import { Document } from '../../models/document';
import { DocumentsService } from '../../services/documents.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplateType } from 'src/app/models/template-type';
import { ConnectableObservable } from 'rxjs';


@Component({
  selector: 'doc-signing',
  templateUrl: 'document-signing.component.html',
  providers: [DocumentsService, UsersService]
})
export class DocumentSignigComponent implements OnInit {
  document?: Document;
  users: User[][] = [];
  selectedSigners: (User|undefined)[] = [];

  constructor(public dialogRef: MatDialogRef<DocumentSignigComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: TemplateType,
    private usersSvc: UsersService) { }

  ngOnInit(){
    console.log(this.data);
    if(!this.data.Positions) return;
    
    for(let pos of this.data.Positions){
      this.selectedSigners.push(new User(-1, "", ""));
      this.usersSvc.getUsers({"position": pos.Id}).subscribe(users =>{
        this.users.push(users);
        console.log(users[0].Position.Name, this.users);}
      );
    }
  }

  isValid(){
    for (let signer of this.selectedSigners)
      if (signer == undefined) return false;
    return true;
  }

  ok(){
    this.dialogRef.close(this.selectedSigners);
  }

}

