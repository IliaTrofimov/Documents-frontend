import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';

@Pipe({
  name: 'shortname',
  pure: true,
})
export class ShortNamePipe implements PipeTransform {

  transform(user?: User): string {
    if (!user || !user.Lastname) return "Неизвестный";
    else if (!user.Firstname) return user.Lastname;
    else if (!user.Fathersname) return `${user.Lastname} ${user.Firstname[0]}.`;
    else return `${user.Lastname} ${user.Firstname[0]}. ${user.Fathersname[0]}.`;
  }

}