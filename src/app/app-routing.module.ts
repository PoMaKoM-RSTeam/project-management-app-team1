import { WelcomePageComponent } from './core/pages/welcome-page/welcome-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivateGuard } from './core/guards/activate.guard';
import { LoadGuard } from './core/guards/load.guard';
import { ProfilePageComponent } from './core/pages/profile-page/profile-page.component';

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'profile', component: ProfilePageComponent },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((a) => a.HomeModule),
    canActivate: [ActivateGuard],
    canLoad: [LoadGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((a) => a.LoginModule),
  },
  { path: '**', component: WelcomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
