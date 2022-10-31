import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { LocalizedDatePipe } from './pipes/localized-date.pipe';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: false,
    }),
  ],
  exports: [TranslateModule, LocalizedDatePipe],
  declarations: [
    LocalizedDatePipe
  ],
})
export class CoreModule {
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('en');

    let browserLang = this.translate.getBrowserLang()!;
    translate.use(browserLang.match(/en|ru/) ? browserLang : 'en');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
    };
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
