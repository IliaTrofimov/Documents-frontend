import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullname'
})
export class NullNamePipe implements PipeTransform {
  transform(value?: string): string {
    return value ? value : "без названия";
  }
}