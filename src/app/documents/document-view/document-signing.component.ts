import { Component, Inject, OnInit} from '@angular/core';
import { Document } from '../../models/document';
import { DocumentsService } from '../../services/documents.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplateType } from 'src/app/models/template-type';
import { Signatory } from 'src/app/models/signatory';
import { SignatoriesService } from 'src/app/services/signatories.service';


@Component({
  selector: 'doc-signing',
  templateUrl: 'document-signing.component.html',
  providers: [DocumentsService, UsersService, SignatoriesService]
})
export class DocumentSignigComponent implements OnInit {
  document?: Document;
  users: User[][] = [];
  selectedSigners: Signatory[] = [];

  constructor(public dialogRef: MatDialogRef<DocumentSignigComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: {signatories: Signatory[], document: Document},
    private usersSvc: UsersService,
    private signsSvc: SignatoriesService) { }

  ngOnInit(){
    if(!this.data.document.Template?.TemplateType.Positions) return;
    if (this.data.signatories)
      for (let pos of this.data.document.Template?.TemplateType.Positions){
        let sign = this.data.signatories.find(s => s.SignerPositionId == pos.Id)
        this.selectedSigners.push(sign ? sign : new Signatory(-1, -1, -1));
        this.usersSvc.getUsers({"position": pos.Id}).subscribe(users => {
          this.users.push(users);
          console.log(users[0].Position.Name, this.users);}
        );
      }
    else 
      for (let pos of this.data.document.Template?.TemplateType.Positions){
        this.selectedSigners.push(new Signatory(-1, -1, -1));
        this.usersSvc.getUsers({"position": pos.Id}).subscribe(users => {
          this.users.push(users);
          console.log(users[0].Position.Name, this.users);}
        );
      }
    
  }

  onValueChanged(user: User, event: any){
    let sign = this.selectedSigners.find(s => s.SignerPositionId == user.PositionId);
    if (sign){
      if (sign.UserId == -1)
        this.signsSvc.deleteSign(sign.UserId, this.data.document.Id).subscribe();
        
      sign.UserId = event.value;
      sign.Firstname = user.Firstname;
      sign.Lastname = user.Lastname;
      sign.Fathersname = user.Fathersname ? user.Fathersname : "";
    }
    if (event.value != -1)
      this.signsSvc.createSign(event.value, this.data.document.Id, this.data.document.AuthorId, user.PositionId).subscribe();
  }

  ok(){
    this.dialogRef.close(this.selectedSigners);
  }
}

