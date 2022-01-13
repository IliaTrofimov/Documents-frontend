import { Pipe, PipeTransform } from '@angular/core';
import { DocTypes } from '../models';

@Pipe({
  name: 'doctype'
})
export class DocumentTypePipe implements PipeTransform {

  transform(value: DocTypes): string {
    switch(value){
      case DocTypes.InUse: return "используется";
      case DocTypes.InWork: return "в работе";
      case DocTypes.Old: return "устарел";
      case DocTypes.Signing: return "на подписании";
      default: return "неизвестно";
    }
  }
}
