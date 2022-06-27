import { Component, Inject, OnInit} from '@angular/core';
import { Document } from '../../models/document';
import { DocumentsService } from '../../services/documents.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    if (!this.data.document.Template?.TemplateType.Positions) return;
    if (this.data.signatories)
      for (let sign of this.data.signatories){
        this.usersSvc.getUsers({"position": sign.SignerPositionId}).subscribe(users => {
          this.users.push(users);
          console.log(users[0].Position.Name, this.users);
        });
      }
  }

  onValueChanged(sign: Signatory, event: any){
    console.log("sign:", sign, "data:", event)
    if (event.value)
      this.signsSvc.updateSign(sign.Id, event.value).subscribe();
  }

  ok(){
    this.dialogRef.close(this.selectedSigners);
  }
}

