import { CoreModule } from './../core/core.module';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BoardsListComponent } from './components/boards-list/boards-list.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { RouterModule, Routes } from '@angular/router';
import { ActivateGuard } from '../core/guards/activate.guard';

const routes: Routes = [
  { path: '', component: HomePageComponent, canActivate: [ActivateGuard] },
];
@NgModule({
  declarations: [HomePageComponent, BoardsListComponent],
  imports: [
    CommonModule,
    CoreModule,
    MatIconModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class HomeModule {}
