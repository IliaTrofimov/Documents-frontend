import { Component } from '@angular/core';

@Component({
  selector: 'site-footer',
  template: `
    <footer class="hidden-print  py-3 my-4 footer navbar-fixed-bottom footer">
      <p class="hidden-print  text-center text-muted noprint">&copy; 2022 Илья Трофимов</p>
      <p class="hidden-print  text-center">
        <button type="button" class="hidden-print  btn btn-sm btn-outline-primary" id="btn-scroll-up" onclick="window.scrollTo(0, 0)">Вверх</button>
      </p>
    </footer>
  `
})
export class SiteFooterComponent { }