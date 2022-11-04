import {ChangeDetectionStrategy, Component} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private currentLang = window.navigator.language.replace(/-.+/gsi, '');

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    this.translate.use(this.currentLang);
  }

  switchLang() {
    this.currentLang = this.currentLang === 'en' ? 'ru' : 'en';
    this.translate.use(this.currentLang);
  }
}
