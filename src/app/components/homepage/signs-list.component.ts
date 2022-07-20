import { Component, Input, OnInit} from '@angular/core';
import { SignatoriesService } from '../../services/signatories.service';
import { Signatory } from '../../models/signatory';
import { AlertService } from '../../services/alert.service';


/** Встраиваемый элемент для отображения подписей 
* Поддерживает фильтрациию и пагинацию, в зависимоти от фильтра несколько меняется вид элемента.
* @param {number} page - номер страницы пагинатора
* @param {number} pageSize - количество элементов на странице
* @param {number} signerId - CWID подписанта (по умолчанию undefined - без фильтра)
* @param {number} initiatorId - CWID инициатора (по умолчанию undefined - без фильтра)
*/
@Component({
  selector: 'signs-list',
  templateUrl: 'signs-list.component.html',
  providers: [SignatoriesService]
})
export class SignsListComponent implements OnInit {
  @Input() signs?: Signatory[];
  @Input() page: number = 0;
  @Input() pageSize: number = 20;
  @Input() signerId?: string;
  @Input() initiatorId?: string;
  @Input() showOld: boolean = true;
  maxPages: number = 0;
  totalElements: number = 0;

  public permissions: string[] = [];
  public displayedColumns: string[] = ["Document", "User", "Created", "SignedAt", "Status"];


  constructor(private alertSvc: AlertService,
    private signsService: SignatoriesService) { }

  ngOnInit(){
    const query = {
      "page": this.page, 
      "pageSize": this.pageSize, 
      "initiatorId": this.initiatorId, 
      "userId": this.signerId,
      "showOld": this.showOld,
      "showUnassigned": true
    };
  
    this.signsService.count(query).subscribe(count => this.maxPages = Math.floor((this.totalElements = count) / this.pageSize))
    this.signsService.getSigns(query).subscribe(signs => this.signs = signs);
  }


  resign(s: Signatory, status: boolean){
    s.Signed = status;
    this.signsService.updateSign(s).subscribe(() => {
      this.signsService.notify(s).subscribe(() => this.alertSvc.info(status ? "Документ подписан" : "Документ отклонён"));
    })
  }

  nextPage(delta: number){
    this.page += delta;
    this.ngOnInit();
  }
  
}
