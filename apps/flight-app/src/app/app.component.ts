import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'flight-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private translateService: TranslateService) {
    this.translateService.addLangs(['en', 'es']);
    this.translateService.setDefaultLang('es');
    this.translateService.use('es');
  }
}
