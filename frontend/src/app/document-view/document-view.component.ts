import { switchMap } from 'rxjs/operators';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DocumentInfo, DocumentData, DocTemplate, TableField, DocTypes, User } from '../models/data-models';
import { DocumentsService } from '../services/documents.service';
import { ValidationService } from '../services/validation.service';
import { UsersService } from '../services/users.service';


@Component({
  selector: 'app-document-view',
  templateUrl: './document-view.component.html',
  providers: [DocumentsService,]
})
export class DocumentViewComponent implements OnInit {
  documentInfo: DocumentInfo = new DocumentInfo(-1, "", -1);
  documentData: DocumentData = new DocumentData(-1, []); 
  documentAuthor: User = new User(-1, "неизвестно");
  template: DocTemplate = new DocTemplate(-1, "");
  status?: string;
  validated: boolean = true;
  private id: number = -1;

  constructor(private docServ: DocumentsService,
    private validServ: ValidationService,
    private usersServ: UsersService,
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(switchMap(params => params.getAll('id'))).subscribe(data => this.id = +data);
    this.loadData();   
  }

  private loadData(){
    this.docServ.getJoinedDocument(this.id).subscribe({
      next: (merged) => {
        this.documentInfo = merged.info;
        this.documentData = merged.data;
        this.template = merged.template;
        this.usersServ.getUser(this.documentInfo.author).subscribe(user => this.documentAuthor = user);
        this.initData();
      },
      error: (e) => this.getErrorPage()
    });
  }

  private getErrorPage(){
    this.router.navigate(['not-found'], { 
      queryParams: {
        "requestedId": this.id, 
        "requestedObject": "документ"
      } 
    });
  }

  private initData(){
    if(this.documentData.data == null || this.documentData.data.length < this.template.fields.length){
      for(let f of this.template.fields){
        if(f._class == "InputField")
          this.documentData.data.push("");
        else if(f._class == "TableField"){
          // инициализируем таблицы, чтобы в JSON не было null
          let templateTable = f as TableField;
          let temp = new Array<string[]>(templateTable.rows);
          
          for(let j = 0; j < templateTable.rows; j++){
            temp[j] = new Array<string>(templateTable.columns.length);
            for(let i = 0; i < templateTable.columns.length; i++)
              temp[j][i] = "";
          }

          this.documentData.data.push(temp);
        }
      }

      this.docServ.updateJoinedDocument(this.documentData, this.documentInfo).subscribe();
    }
  }

  updateField(index: number, data: string|undefined){
    if(data)
      this.documentData.data[index] = data;
  }

  previewSave(){
    // Сбрасываем validated, т.к. можно узнать только о провале валидации.
    this.validated = true;
    let listner = this.validServ.start().subscribe({
      complete: () => this.validated = false
    })
 
    // Ждём некоторое время окончания валидации
    new Promise(resolve => setTimeout(resolve, 200)).then(() => {
      this.save();
      listner.unsubscribe();
    })
  }

  save(){
    if(this.validated){
      this.docServ.updateJoinedDocument(this.documentData, this.documentInfo).subscribe({
        error: error => this.status = error,
        complete: () => this.status = "ok"
      });
    }
    else{
      this.status = "Недопустимые данные.";
    }
  }

  delete(){
    this.docServ.deleteJoinedDocument(this.documentData.id).subscribe();
    this.router.navigate(["/documents"]);
  }

  nextType(){
    if(this.documentInfo.type != DocTypes.Old){
      this.documentInfo.type++;
      this.docServ.updateJoinedDocument(this.documentData, this.documentInfo).subscribe({
        error: error => this.status = error,
        complete: () => this.status = "ok"
      });
    }
  } 
}
