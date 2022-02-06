import { Pipe, PipeTransform } from '@angular/core';
import { InputFieldType } from '../models/data-models';

@Pipe({
  name: 'inputtype'
})
export class HTMLInputTypePipe implements PipeTransform {

  transform(value: InputFieldType): string {
    switch(value){
      case InputFieldType.Text:
      case InputFieldType.Registry: return "text";
      case InputFieldType.Date: return "date";
      case InputFieldType.Number: return "number";
    }
  }
}