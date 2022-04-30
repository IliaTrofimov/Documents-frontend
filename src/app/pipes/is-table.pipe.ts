import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isTable',
  pure: true,
})
export class IsTablePipe implements PipeTransform {

  transform<T>(value: any): boolean {
    return value.Rows != undefined;
  }

}