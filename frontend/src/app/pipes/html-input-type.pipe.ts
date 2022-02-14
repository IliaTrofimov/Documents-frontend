import { Pipe, PipeTransform } from '@angular/core';
import { InputType } from '../models/template-models';

@Pipe({
  name: 'inputtype'
})
export class HTMLInputTypePipe implements PipeTransform {

  transform(value: InputType): string {
    switch(value){
      case InputType.Text:
      case InputType.Registry: return "text";
      case InputType.Date: return "date";
      case InputType.Number: return "number";
    }
  }
}