import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private currentLang = 'en';

  constructor(public translate: TranslateService) {}

  switchLang() {
    this.currentLang = this.currentLang === 'en' ? 'ru' : 'en';
    this.translate.use(this.currentLang);
  }
}
