import { Component } from '@angular/core';

@Component({
  selector: 'site-footer',
  template: `
    <footer class="py-3 my-4 footer navbar-fixed-bottom footer">
      <p class="text-center text-muted noprint">&copy; 2022 Илья Трофимов</p>
      <p class="text-center">
        <button type="button" onclick="window.scrollTo(0, 0)" class="btn btn-sm btn-outline-primary">Вверх</button>
      </p>
    </footer>
  `
})
export class SiteFooterComponent { }