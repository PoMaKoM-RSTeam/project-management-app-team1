import { WelocomePageComponent } from './core/pages/welocome-page/welocome-page.component';
import { NgModule } from '@angular/core';
// eslint-disable-next-line import/named
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: WelocomePageComponent },
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
