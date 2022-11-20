import { TasksDataService } from './../../../core/services/tasks-data.service';
import { UserStatusService } from './../../../core/services/user-status.service';
import { IUser } from './../../../core/models/user.model';
import { switchMap, map, Observable, Subject, takeUntil, take } from 'rxjs';
import { ColumnsDataService } from './../../../core/services/columns-data.service';
import { ConfirmDialogComponent } from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CreateUpdateModalComponent } from '../../../shared/components/project-create-update-modal/create-update-modal.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogModel,
  ICreateEditModel,
} from './../../../core/models/dialog.model';
import {
  IColumn,
  ITask,
  TColumnInfo,
  TTaskInfoExtended,
} from './../../../core/models/data.model';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardColumnComponent implements OnInit, OnDestroy {
  @Input() public column!: IColumn;

  public users$!: Observable<IUser[]>;

  public tasks$!: Observable<ITask[]>;

  private destroy$: Subject<boolean> = new Subject();

  public tasks: ITask[] = [];

  titleEditMode: boolean = false;

  public columnTitle: string = '';

  private currentTitle: string = '';

  constructor(
    private projectModal: MatDialog,
    private columnsService: ColumnsDataService,
    private userStatusService: UserStatusService,
    public tasksService: TasksDataService
  ) {}

  ngOnInit(): void {
    this.columnTitle = this.column.title;
    this.currentTitle = this.columnTitle;
    this.userStatusService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    this.tasks$ = this.tasksService.getTasksField().pipe((value) => value);
    this.getList();
  }

  getList() {
    this.tasksService
      .getTasks(this.column.boardId, this.column._id)
      .pipe(take(1))
      .subscribe((tasks) => {
        this.tasks = tasks.sort((a, b) => (a.order > b.order ? 1 : -1));
      });
  }

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (this.tasks[event.previousIndex] !== this.tasks[event.currentIndex]) {
        let taskInfo: TTaskInfoExtended = {
          title: this.tasks[event.currentIndex].title,
          order: event.currentIndex,
          description: this.tasks[event.currentIndex].description,
          userId: this.tasks[event.currentIndex].userId,
          users: this.tasks[event.currentIndex].users,
          columnId: this.tasks[event.currentIndex].columnId,
        };

        this.tasksService
          .updateTask(
            this.tasks[event.currentIndex].boardId,
            this.tasks[event.currentIndex].columnId,
            this.tasks[event.currentIndex]._id,
            taskInfo
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe();

        taskInfo = {
          title: this.tasks[event.previousIndex].title,
          order: event.previousIndex,
          description: this.tasks[event.previousIndex].description,
          userId: this.tasks[event.previousIndex].userId,
          users: this.tasks[event.previousIndex].users,
          columnId: this.tasks[event.previousIndex].columnId,
        };

        this.tasksService
          .updateTask(
            this.tasks[event.previousIndex].boardId,
            this.tasks[event.previousIndex].columnId,
            this.tasks[event.previousIndex]._id,
            taskInfo
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      }
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      let taskInfo: TTaskInfoExtended = {
        title: this.tasks[event.currentIndex].title,
        order: event.currentIndex,
        description: this.tasks[event.currentIndex].description,
        userId: this.tasks[event.currentIndex].userId,
        users: this.tasks[event.currentIndex].users,
        columnId: this.column._id,
      };

      this.tasksService
        .updateTask(
          this.tasks[event.currentIndex].boardId,
          this.column._id,
          this.tasks[event.currentIndex]._id,
          taskInfo
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe();

      if (this.tasks[event.previousIndex] !== this.tasks[event.currentIndex]) {
        taskInfo = {
          title: this.tasks[event.previousIndex].title,
          order: event.previousIndex,
          description: this.tasks[event.previousIndex].description,
          userId: this.tasks[event.previousIndex].userId,
          users: this.tasks[event.previousIndex].users,
          columnId: this.tasks[event.previousIndex].columnId,
        };

        this.tasksService
          .updateTask(
            this.tasks[event.previousIndex].boardId,
            this.tasks[event.previousIndex].columnId,
            this.tasks[event.previousIndex]._id,
            taskInfo
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      }
    }
  }

  editTitle() {
    this.titleEditMode = true;
  }

  onCancel() {
    this.columnTitle = this.currentTitle;
    this.titleEditMode = false;
  }

  updateColumn(columnTitle: string) {
    this.currentTitle = columnTitle;
    this.titleEditMode = false;
    const columnInfo: TColumnInfo = {
      title: columnTitle,
      order: this.column.order,
    };
    this.columnsService
      .updateColumn(this.column.boardId, this.column._id, columnInfo)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  deleteColumn(columnId: string) {
    const dialogData = new ConfirmDialogModel(
      'Columns-modal-delete-title',
      'Columns-modal-delete-message',
      'Delete'
    );

    const dialogRef = this.projectModal.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.columnsService
          .deleteColumn(this.column.boardId, columnId)
          .pipe(
            switchMap(() =>
              this.columnsService
                .getColumns(this.column.boardId)
                .pipe(map((value) => value))
            ),
            takeUntil(this.destroy$)
          )
          .subscribe();
      }
    });
  }

  addNewTask() {
    const dialogData: ICreateEditModel = {
      title: 'Task-modal-add-title',
      titleLabel: 'Task-modal-title',
      descriptionLabel: 'Task-modal-description',
      commandName: 'Task-modal-add',
      usersLabel: 'Task-modal-user-titel',
      users: this.userStatusService.users.value,
    };

    const dialogRef = this.projectModal.open(CreateUpdateModalComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.tasksService
          .createTask(
            dialogResult[0],
            dialogResult[1],
            this.tasks.length,
            this.column._id,
            this.column.boardId,
            this.userStatusService.userId,
            dialogResult[2]
          )
          .pipe(
            switchMap(() =>
              this.tasksService
                .getTasks(this.column.boardId, this.column._id)
                .pipe(map((value) => value))
            ),
            takeUntil(this.destroy$)
          )
          .subscribe((tasks) => {
            this.tasks = tasks.sort((a, b) => (a.order > b.order ? 1 : -1));
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
