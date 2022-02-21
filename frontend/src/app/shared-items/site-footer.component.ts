import { Component } from '@angular/core';

@Component({
  selector: 'site-footer',
  template: `
    <footer class="noprint py-3 my-4 footer navbar-fixed-bottom footer">
      <p class="text-center text-muted noprint">&copy; 2022 Илья Трофимов</p>
      <p class="text-center noprint">
        <button type="button" class="btn btn-sm btn-outline-primary noprint" id="btn-scroll-up" onclick="window.scrollTo(0, 0)">Вверх</button>
      </p>
    </footer>
  `
})
export class SiteFooterComponent { }