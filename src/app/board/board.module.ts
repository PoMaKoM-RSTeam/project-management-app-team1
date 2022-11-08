import { ActivateGuard } from './../core/guards/activate.guard';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BoardComponent } from './pages/board/board.component';
import { TaskComponent } from './components/task/task.component';

const routes: Routes = [
  { path: '', component: BoardComponent, canActivate: [ActivateGuard] },
];
@NgModule({
  declarations: [
    BoardComponent,
    TaskComponent
  ],
  imports: [
    CommonModule, 
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class BoardModule {}
