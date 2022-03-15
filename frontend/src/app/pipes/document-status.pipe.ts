import { Pipe, PipeTransform } from '@angular/core';
import { DocumentStatus } from '../models/document';

@Pipe({
  name: 'doctstatus'
})
export class DocumentStatusPipe implements PipeTransform {

  transform(value: DocumentStatus): string {
    switch(value){
      case DocumentStatus.InUse: return "используется";
      case DocumentStatus.InWork: return "в работе";
      case DocumentStatus.Old: return "устарел";
      case DocumentStatus.Signing: return "на подписании";
      default: return "неизвестно";
    }
  }
}
