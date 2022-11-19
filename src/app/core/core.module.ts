import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { LocalizedDatePipe } from './pipes/localized-date.pipe';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { UserStatusComponent } from './components/user-status/user-status.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ToastrModule } from 'ngx-toastr';

const routes: Routes = [];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: false,
    }),
    RouterModule.forChild(routes),
    MatProgressBarModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      easing: 'ease-in',
      progressBar: true,
      maxOpened: 1,
      autoDismiss: true,
      positionClass: 'toast-bottom-right'
    }),

  ],
  exports: [
    LocalizedDatePipe,
    RouterModule,
    TranslateModule,
    UserStatusComponent,
    WelcomePageComponent,
    FooterComponent,
    HeaderComponent,
  ],
  declarations: [
    ConfirmDialogComponent,
    ProfilePageComponent,
    UserStatusComponent,
    LocalizedDatePipe,
    WelcomePageComponent,
    FooterComponent,
    HeaderComponent,
    NotFoundPageComponent,
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
