import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'navbar-cmp',
  templateUrl: 'navbar.component.html'
})
export class NavbarComponent {
  private sidebarVisible = false;

  constructor(private translateService: TranslateService) {}

  sidebarToggle(): void {
    const body = document.getElementsByTagName('body')[0];

    if (this.sidebarVisible === false) {
      body.classList.add('nav-open');
      this.sidebarVisible = true;
    } else {
      this.sidebarVisible = false;
      body.classList.remove('nav-open');
    }
  }

  setLang(lang: string): void {
    this.translateService.use(lang);

    // notify backend
  }
}
