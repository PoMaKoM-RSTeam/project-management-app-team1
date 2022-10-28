import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsListComponent } from './components/boards-list/boards-list.component';
import { HomePageComponent } from './pages/home/home-page.component';
// eslint-disable-next-line import/named
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: HomePageComponent }];
@NgModule({
  declarations: [
    HomePageComponent,
    BoardsListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ],
})
export class HomeModule { }
