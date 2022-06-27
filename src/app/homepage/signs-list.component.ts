import { Component, Input, OnInit} from '@angular/core';
import { SignatoriesService } from '../services/signatories.service';
import { Signatory } from '../models/signatory';
import { AlertService } from '../services/alert.service';


@Component({
  selector: 'signs-list',
  templateUrl: 'signs-list.component.html',
  providers: [SignatoriesService]
})
export class SignsListComponent implements OnInit {
  @Input() signs?: Signatory[];
  @Input() page: number = 0;
  @Input() pageSize: number = 20;
  @Input() signerId: number = -1;
  @Input() initiatorId: number = -1;
  @Input() maxPages: number = 0;
  totalElements: number = 0;

  public permissions: string[] = [];
  public displayedColumns: string[] = ["Document", "User", "Created", "Status"];


  constructor(private alertSvc: AlertService,
    private signsService: SignatoriesService) { }

  ngOnInit(){
    const query = {
      "page": this.page, 
      "pageSize": this.pageSize, 
      "initiatorId": this.initiatorId, 
      "userId": this.signerId
    };
  
    this.signsService.count(query).subscribe(count => this.maxPages = Math.floor((this.totalElements = count) / this.pageSize))
    this.signsService.getSigns(query).subscribe(signs => {this.signs = signs; console.log(signs)});
  }


  resign(s: Signatory, status: boolean){
    s.Signed = status;
    this.signsService.updateSign(s.Id, s.UserId, status).subscribe(() => {
      this.signsService.notify(s).subscribe(() => this.alertSvc.info(status ? "Документ подписан" : "Документ отклонён"));
    })
  }

  nextPage(delta: number){
    this.page += delta;
    this.ngOnInit();
  }
  
}
