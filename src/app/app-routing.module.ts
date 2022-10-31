import { WelcomePageComponent } from './core/pages/welcome-page/welcome-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((a) => a.HomeModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((a) => a.LoginModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
