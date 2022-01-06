import { Component } from '@angular/core';

@Component({
  selector: 'site-footer',
  template: `
    <footer class="py-3 my-4 footer navbar-fixed-bottom">
      <p class="text-center text-muted">&copy; 2022 Илья Трофимов</p>
      <p class="text-center">
        <button type="button" class="btn btn-sm btn-outline-primary" id="btn-scroll-up" onclick="window.scrollTo(0, 0)">Вверх</button>
      </p>
    </footer>
  `
})
export class SiteFooterComponent { }