import { WelocomePageComponent } from './core/pages/welocome-page/welocome-page.component';
import { NgModule } from '@angular/core';
// eslint-disable-next-line import/named
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: WelocomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
