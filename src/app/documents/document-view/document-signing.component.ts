import { Component, Inject, OnInit} from '@angular/core';
import { Document } from '../../models/document';
import { DocumentsService } from '../../services/documents.service';
import { TemplateField } from 'src/app/models/template-field';
import { TemplateTable } from 'src/app/models/template-table';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';
import { SignatoriesService } from 'src/app/services/signatories.service';
import { Signatory } from 'src/app/models/signatory';
import { User } from 'src/app/models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Position } from 'src/app/models/position';


@Component({
  selector: 'doc-signing',
  templateUrl: 'document-signing.component.html',
  providers: [DocumentsService, UsersService, SignatoriesService]
})
export class DocumentSignigComponent implements OnInit {
  Field = TemplateField;
  Table = TemplateTable;

  document?: Document;
  users: {[pos: string]: User[]} = {};
  selectedSigners:{[pos: string]: User|undefined} = {};

  constructor(private alertSvc: AlertService,
    public dialogRef: MatDialogRef<DocumentSignigComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Document,
    private usersSvc: UsersService,
    private signsSvc: SignatoriesService) { }

  ngOnInit(){
    if(!this.data.Template?.TemplateType?.Positions) return;
    
    for(let pos of this.data.Template.TemplateType.Positions){
      if (!pos) continue;
      this.selectedSigners[pos.Name] = undefined;
      
      this.usersSvc.getUsers({"position": pos.Id}).subscribe(users =>{
        if(pos){
          this.users[pos.Name] = users;
          console.log(pos.Name + pos.Id, users);

        }
         
      })
    }
  }

  isValid(){
    for (let signer in this.selectedSigners){
      if (this.selectedSigners[signer] == undefined) 
        return false;
    }
    return true;
  }

  ok(){
    this.dialogRef.close(true);
  }

}

