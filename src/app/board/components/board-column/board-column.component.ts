import { TasksDataService } from './../../../core/services/tasks-data.service';
import { UserStatusService } from './../../../core/services/user-status.service';
import { IUser } from './../../../core/models/user.model';
import { switchMap, map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ColumnsDataService } from './../../../core/services/columns-data.service';
import { ConfirmDialogComponent } from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CreateUpdateModalComponent } from '../../../shared/components/project-create-update-modal/create-update-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, ICreateEditModel } from './../../../core/models/dialog.model';
import { IColumn, ITask, TColumnInfo } from './../../../core/models/data.model';
import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss']
})
export class BoardColumnComponent implements OnInit {
  @Input() public column!: IColumn;

  public users$!: Observable<IUser[]>;

  public tasks$!: Observable<ITask[]>;

  tasks: ITask[] = [];

  titleEditMode: boolean = false;

  columnTitle: string = '';

  currentTitle: string = '';

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep', 'Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  constructor(
    private projectModal: MatDialog, 
    private columnsService: ColumnsDataService,
    private activatedRoute: ActivatedRoute,
    private userStatusService: UserStatusService,
    public tasksService: TasksDataService
  ) { }

  ngOnInit(): void {
    this.userStatusService.getAllUsers().subscribe();
    this.users$ = this.userStatusService.getUsers().pipe(value => value);
    this.tasksService.getTasks(this.activatedRoute.snapshot.params['id'], this.column._id).subscribe(tasks => {
      this.tasks = tasks;
    });
    this.tasks$ = this.tasksService.getTasksField().pipe(value => value);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
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
          .deleteColumn(this.activatedRoute.snapshot.params['id'], columnId)
          .pipe(
            switchMap(() =>
              this.columnsService.getColumns(this.activatedRoute.snapshot.params['id']).pipe(map((value) => value))
            )
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
      users: this.userStatusService.users.value
    };

    const dialogRef = this.projectModal.open(
      CreateUpdateModalComponent,
      {
        maxWidth: '600px',
        data: dialogData,
      }
    );

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.tasksService
          .createTask(
            dialogResult[0],
            dialogResult[1],
            this.tasksService.tasks.value.length,
            this.column._id,
            this.activatedRoute.snapshot.params['id'],
            dialogResult[2]
          )
          .pipe(
            switchMap(() =>
              this.tasksService.getTasks(this.activatedRoute.snapshot.params['id'], this.column._id).pipe(map((value) => value))
            )
          )
          .subscribe(tasks => {
            this.tasks = tasks;
          });
      }
    });
  }
}
