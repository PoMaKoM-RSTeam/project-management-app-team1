import { WelcomePageComponent } from './core/pages/welcome-page/welcome-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivateGuard } from './core/guards/activate.guard';
import { LoadGuard } from './core/guards/load.guard';
import { ProfilePageComponent } from './core/pages/profile-page/profile-page.component';
import { NotFoundPageComponent } from './core/pages/not-found-page/not-found-page.component';

const routes: Routes = [
  { path: '', component: WelcomePageComponent, title: 'Project Manager' },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [ActivateGuard],
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((a) => a.HomeModule),
    canLoad: [LoadGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((a) => a.LoginModule),
  },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
