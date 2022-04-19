import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../app.config';
import { User } from '../models/user';

@Component({
  selector: 'test-component',
  template: `
   <div *ngFor="let i of items()">
      <input [(ngModel)]="i.v"> => {{i.v}}
   </div>
  `,
})
export class TestComponent  {
  private items_list: {v: number}[] = [{v:1}, {v:2}, {v:3}, {v:4}, {v:5}]

  constructor(private config: AppConfig){}

  *items(){
    for (let i of this.items_list){
      console.log(`i = ${i}`);
      yield i;
    }
    return undefined;
  }

}
