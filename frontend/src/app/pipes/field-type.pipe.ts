import { Pipe, PipeTransform } from '@angular/core';
import { InputType } from '../models/template-row';

@Pipe({
  name: 'fieldtype'
})
export class FieldTypePipe implements PipeTransform {

  transform(value: InputType): string {
    switch(value){
      case InputType.Text:  return "текст";
      case InputType.Registry: return "реестр";
      case InputType.Date: return "дата";
      case InputType.Number: return "число";
    }
  }
}