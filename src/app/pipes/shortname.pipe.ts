import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortname',
  pure: true,
})
export class ShortNamePipe implements PipeTransform {

  transform(user: {Lastname: string, Firstname?: string, Fathersname?: string}): string {
      if (!user.Lastname ) return "Неизвестный";
      else if (!user.Firstname) return user.Lastname;
      else if (!user.Fathersname) return `${user.Lastname} ${user.Firstname[0]}.`;
      else return `${user.Lastname} ${user.Firstname[0]}. ${user.Fathersname[0]}.`;
  }
}