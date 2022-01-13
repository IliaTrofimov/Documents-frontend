import { Pipe, PipeTransform } from '@angular/core';
import { RestrictionTypes } from '../models';

@Pipe({
  name: 'restriction'
})
export class RestrictionPipe implements PipeTransform {

  transform(value: RestrictionTypes): string {
    switch(value){
      case RestrictionTypes.None: return "любое значение";
      case RestrictionTypes.Only: return "любое из";
      case RestrictionTypes.Except: return "любое кроме";
      case RestrictionTypes.Registry: return "реестр";
    }
  }

}