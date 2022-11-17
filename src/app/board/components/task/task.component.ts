import { CreateUpdateModalComponent } from './../../../shared/components/project-create-update-modal/create-update-modal.component';
import { switchMap, map } from 'rxjs';
import { TasksDataService } from './../../../core/services/tasks-data.service';
import { UserStatusService } from 'src/app/core/services/user-status.service';
import { ConfirmDialogComponent } from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogModel,
  ICreateEditModel,
} from './../../../core/models/dialog.model';
import { ITask, TTaskInfoExtended } from './../../../core/models/data.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input() public task!: ITask;

  @Output() public edited = new EventEmitter<any>();

  @Output() public removed = new EventEmitter<any>();

  constructor(
    private projectModal: MatDialog,
    private userStatusService: UserStatusService,
    public tasksService: TasksDataService
  ) {}

  ngOnInit(): void {
    this.tasksService
      .getTasks(this.task.boardId, this.task.columnId)
      .subscribe();
    this.tasksService.getTasksField().pipe((value) => value);
  }

  updateTask() {
    const dialogData: ICreateEditModel = {
      title: 'Task-modal-add-title',
      titleLabel: 'Task-modal-title',
      descriptionLabel: 'Task-modal-description',
      commandName: 'Task-modal-add',
      usersLabel: 'Task-modal-user-titel',
      titleField: this.task.title,
      descriptionField: this.task.description,
      user: this.task.users[0],
      users: this.userStatusService.users.value,
    };

    const dialogRef = this.projectModal.open(CreateUpdateModalComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        let taskInfo: TTaskInfoExtended = {
          title: dialogResult[0],
          order: this.task.order,
          description: dialogResult[1],
          userId: this.userStatusService.userId,
          users: dialogResult[2],
          columnId: this.task.columnId,
        };
        this.tasksService
          .updateTask(
            this.task.boardId,
            this.task.columnId,
            this.task._id,
            taskInfo
          )
          .pipe(
            switchMap(() =>
              this.tasksService
                .getTasks(this.task.boardId, this.task.columnId)
                .pipe(map((value) => value))
            )
          )
          .subscribe(() => this.edited.emit());
      }
    });
  }

  deleteTask() {
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
        this.tasksService
          .deleteTask(this.task.boardId, this.task.columnId, this.task._id)
          .pipe(
            switchMap(() =>
              this.tasksService
                .getTasks(this.task.boardId, this.task.columnId)
                .pipe(
                  map((value) => {
                    this.tasksService.tasks.next(value);
                  })
                )
            )
          )
          .subscribe(() => {
            this.removed.emit();
          });
      }
    });
  }
}
