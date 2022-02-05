import { Pipe, PipeTransform } from '@angular/core';
import { InputFieldType } from '../models';

@Pipe({
  name: 'fieldtype'
})
export class FieldTypePipe implements PipeTransform {

  transform(value: InputFieldType): string {
    switch(value){
      case InputFieldType.Text:  return "текст";
      case InputFieldType.Registry: return "реестр";
      case InputFieldType.Date: return "дата";
      case InputFieldType.Number: return "число";
    }
  }
}