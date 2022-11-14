import { IColumn, TColumnInfo } from './../../../core/models/data.model';
import { Component, Input } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ColumnsDataService } from 'src/app/core/services/columns-data.service';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss'],
})
export class BoardColumnComponent {
  @Input() public column!: IColumn;

  titleEditMode: boolean = false;

  columnTitle: string = '';

  currentTitle: string = '';

  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep',
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep',
  ];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  constructor(private columnsService: ColumnsDataService) {}

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  editTitle() {
    this.titleEditMode = true;
  }

  onCancel() {
    this.titleEditMode = false;
    this.columnTitle = this.currentTitle;
  }

  updateColumn(columnTitle: string) {
    this.titleEditMode = false;
    const columnInfo: TColumnInfo = {
      title: columnTitle,
      order: this.column.order,
    };
    this.columnsService
      .updateColumn(this.column.boardId, this.column._id, columnInfo)
      .pipe(
        switchMap(() =>
          this.columnsService
            .getColumns(this.column.boardId)
            .pipe(map((value) => value))
        )
      )
      .subscribe();
  }

  deleteColumn() {}
}
