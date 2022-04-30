import { Component } from '@angular/core';

@Component({
  selector: 'dictionaries-main',
  template: `
    <h4>Вспомогательные таблицы</h4>
    <ul class="list-groupow">
      <li class="list-group-item"><a [routerLink]="['users']">Список пользователей</a></li>
      <li class="list-group-item"><a [routerLink]="['templatetypes']">Список типов шаблонов</a></li>
      <li class="list-group-item"><a [routerLink]="['users']">Список пользователей</a></li>
    </ul>
  `
})
export class DictionariesComponent {}
