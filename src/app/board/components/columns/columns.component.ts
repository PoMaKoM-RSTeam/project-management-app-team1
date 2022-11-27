import { BoardColumnComponent } from './../board-column/board-column.component';
import { IColumn, TColumnInfo } from './../../../core/models/data.model';
import { switchMap, map, Observable, Subject, takeUntil, take } from 'rxjs';
import { ColumnsDataService } from './../../../core/services/columns-data.service';
import { MatDialog } from '@angular/material/dialog';
import { ICreateEditModel } from './../../../core/models/dialog.model';
import { CreateUpdateModalComponent } from '../../../shared/components/project-create-update-modal/create-update-modal.component';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnsComponent implements OnInit, OnDestroy {
  @ViewChild(BoardColumnComponent) column!: BoardColumnComponent;

  public columns$!: Observable<IColumn[]>;

  columns!: IColumn[];

  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectModal: MatDialog,
    private columnsService: ColumnsDataService
  ) {}

  ngOnInit(): void {
    this.columns$ = this.columnsService
      .getColumnsField()
      .pipe((value) => value);
    this.getList();
  }

  getList() {
    this.columnsService
      .getColumns(this.activatedRoute.snapshot.params['id'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((columns) => {
        if (columns && columns.length > 0) {
          this.columns = columns.sort((a, b) => (a.order > b.order ? 1 : -1));
        } else {
          this.columns = [];
        }
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);

    if (
      this.columns[event.previousIndex] !== this.columns[event.currentIndex]
    ) {
      let columnInfo: TColumnInfo = {
        title: this.columns[event.currentIndex].title,
        order: event.currentIndex,
      };
      this.columnsService
        .updateColumn(
          this.columns[event.currentIndex].boardId,
          this.columns[event.currentIndex]._id,
          columnInfo
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe();
      columnInfo = {
        title: this.columns[event.previousIndex].title,
        order: event.previousIndex,
      };
      this.columnsService
        .updateColumn(
          this.columns[event.previousIndex].boardId,
          this.columns[event.previousIndex]._id,
          columnInfo
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  createColumn() {
    const dialogData: ICreateEditModel = {
      title: 'Columns-modal-add-title',
      titleLabel: 'Columns-modal-title',
      commandName: 'Columns-modal-add',
    };

    const dialogRef = this.projectModal.open(CreateUpdateModalComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((dialogResult) => {
        if (dialogResult) {
          this.columnsService
            .createColumn(
              dialogResult[0],
              this.columnsService.columns.value.length,
              this.activatedRoute.snapshot.params['id']
            )
            .pipe(
              switchMap(() =>
                this.columnsService
                  .getColumns(this.activatedRoute.snapshot.params['id'])
                  .pipe(map((value) => value))
              ),
              take(1)
            )
            .subscribe((columns) => {
              this.columns = columns.sort((a, b) =>
                a.order > b.order ? 1 : -1
              );
            });
        }
      });
  }

  refresh() {
    this.getList();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
