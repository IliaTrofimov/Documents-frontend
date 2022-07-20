import { Pipe, PipeTransform } from '@angular/core';

/** Выводит "без названия", если value пустое */
@Pipe({
  name: 'nullname'
})
export class NullNamePipe implements PipeTransform {
  transform(value?: string): string {
    return value ? value : "без названия";
  }
}