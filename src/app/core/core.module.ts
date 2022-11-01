import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { LocalizedDatePipe } from './pipes/localized-date.pipe';
import { UserStatusComponent } from './components/user-status/user-status.component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

const routes: Routes = [];

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
    MatIconModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    TranslateModule,
    LocalizedDatePipe,
    RouterModule,
    UserStatusComponent,
  ],
  declarations: [UserStatusComponent, LocalizedDatePipe, ConfirmDialogComponent],
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
