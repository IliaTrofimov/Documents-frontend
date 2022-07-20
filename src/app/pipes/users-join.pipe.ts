import { Pipe, PipeTransform } from '@angular/core';


/** Выводит список "Фамилия И.О." или "Неизвестный" через запятую */
@Pipe({
  name: 'joinusers',
  pure: true,
})
export class UsersJoinPipe implements PipeTransform {
  private getShortname(user: {Lastname: string, Firstname?: string, Fathersname?: string}){
    if (!user.Lastname) return "Неизсвестный";
      else if (!user.Firstname) return user.Lastname;
      else if (!user.Fathersname) return `${user.Lastname} ${user.Firstname[0]}.`;
      else return `${user.Lastname} ${user.Firstname[0]}. ${user.Fathersname[0]}.`;
  }

  transform(signs: {User: {Lastname: string, Firstname?: string, Fathersname?: string}}[]): string {
    if (signs.length == 0) return "";
    let str = "";
    signs.forEach(sign => {
      if (sign.User)
        str += this.getShortname(sign.User) + ", ";
    });
    return str.substring(0, str.length - 2);
  }
}