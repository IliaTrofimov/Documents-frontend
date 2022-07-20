import { Component } from '@angular/core';


/** Страница выбора конкретной таблицы */
@Component({
  selector: 'dictionaries-main',
  template: `
    <h4>Вспомогательные таблицы</h4>
    <ul class="list-group">
      <li class="list-group-item"><a [routerLink]="['users']">Список пользователей</a></li>
      <li class="list-group-item"><a [routerLink]="['positions']">Список должностей</a></li>
      <li class="list-group-item"><a [routerLink]="['templatetypes']">Список типов шаблонов</a></li>
    </ul>
  `
})
export class DictionariesComponent {}
