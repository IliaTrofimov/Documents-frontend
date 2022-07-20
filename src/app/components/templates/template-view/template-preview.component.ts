import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { PrintingService } from 'src/app/services/printing.service';


/** Модальное окно для создания нового типа */
@Component({
  selector: 'template-preview',
  templateUrl: 'template-preview.component.html',
  providers: [PrintingService],
  encapsulation: ViewEncapsulation.None,
  styles: ['.var{background-color: yellow;}']
})
export class TemplatePreviewDialog implements OnInit{ 
  html: string = "";
  htmlTemplateFile: File|null = null; 
  htmlTemplateExists: boolean = false;

  constructor(public dialogRef: MatDialogRef<TemplatePreviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {name: string, id: number}, 
    private printSvc: PrintingService,
    private alertSvc: AlertService) { }
   
  ngOnInit(): void {
    this.printSvc.previewHtmlTemplate(this.data.id).subscribe(html => this.html = html);
    this.printSvc.checkExistance(this.data.id).subscribe(res => this.htmlTemplateExists = res);
  }

  changeHtmlTemplateFile(files: any) {
    if (!files || files == null || files.length == 0)
      return;
    this.htmlTemplateFile = files[0];
  }

  uploadHtmlTemplate(){
    if (this.htmlTemplateFile == null) return;

    this.printSvc.uploadHtmlTemplate(this.data.id, this.htmlTemplateFile).subscribe({
      next: res => {
        this.htmlTemplateExists = true;
        this.printSvc.previewHtmlTemplate(this.data.id).subscribe(html => {
          this.html = html;
          this.alertSvc.info("HTML-шаблон " + res.toLowerCase == "updated" ? "обновлён" : "создан");
        });
      }
    });
  }

  downloadTemplate(){
    this.printSvc.getHtmlTemplate(this.data.id, this.data.name);
  }
}