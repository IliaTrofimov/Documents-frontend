import { Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from 'src/app/models/user';
import { Signatory } from 'src/app/models/signatory';
import { Document } from 'src/app/models/document';
import { DocumentsService } from 'src/app/services/documents.service';
import { UsersService } from 'src/app/services/users.service';
import { SignatoriesService } from 'src/app/services/signatories.service';
import { PermissionFlag } from 'src/app/models/permission';
import { Position } from 'src/app/models/position';
import { AlertService } from 'src/app/services/alert.service';


/** Молальное окно для выбора подписантов документа. 
 * При изменении поодписантов, уведомления им не отправляются. */
@Component({
  selector: 'doc-signing',
  templateUrl: 'document-signing.component.html',
  providers: [DocumentsService, UsersService, SignatoriesService]
})
export class DocumentSignigComponent implements OnInit {
  document?: Document;
  users: User[][] = [];
  hasUsers: boolean[] = [];
  selectedSigners: Signatory[] = [];

  constructor(public dialogRef: MatDialogRef<DocumentSignigComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: {signatories: Signatory[], positions: Position[]},
    private usersSvc: UsersService,
    private signsSvc: SignatoriesService,
    private alertSvc: AlertService) { }

  ngOnInit(){
    if (this.data){
      for (let sign of this.data.signatories){
        const query = {"position": sign.SignerPositionId, "permissions": PermissionFlag.ReadDocuments};
        this.usersSvc.getUsers(query).subscribe(users => {
          this.users.push(users);
          this.hasUsers.push(users.length != 0);
        });
      }
    }
  }

  onValueChanged(sign: Signatory, event: any){
    this.signsSvc.updateSign(sign).subscribe(s => {
      sign.UserCWID = s.UserCWID;
      sign.SignerShortname = s.SignerShortname;
      sign.Id = s.Id;
    });
  }
}

