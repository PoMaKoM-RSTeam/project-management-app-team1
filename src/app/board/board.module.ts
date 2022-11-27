import { ActivateGuard } from './../core/guards/activate.guard';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from './../core/core.module';
import { MaterialModule } from '../shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { BoardComponent } from './pages/board/board.component';
import { TaskComponent } from './components/task/task.component';
import { BoardColumnComponent } from './components/board-column/board-column.component';
import { ColumnsComponent } from './components/columns/columns.component';
import { FirstLetterPipe } from './pipes/first-letter.pipe';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: ':id', component: BoardComponent, canActivate: [ActivateGuard] },
];
@NgModule({
  declarations: [
    BoardComponent,
    TaskComponent,
    BoardColumnComponent,
    ColumnsComponent,
    FirstLetterPipe,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class BoardModule {}
