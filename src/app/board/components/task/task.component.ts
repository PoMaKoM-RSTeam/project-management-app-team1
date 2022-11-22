import { CreateUpdateModalComponent } from './../../../shared/components/project-create-update-modal/create-update-modal.component';
import { switchMap, map, Subject, take, Observable } from 'rxjs';
import { TasksDataService } from './../../../core/services/tasks-data.service';
import { UserStatusService } from 'src/app/core/services/user-status.service';
import { ConfirmDialogComponent } from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogModel,
  ICreateEditModel,
} from './../../../core/models/dialog.model';
import {
  IFile,
  ITask,
  TTaskInfoExtended,
} from './../../../core/models/data.model';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() public task!: ITask;

  @Output() public edited = new EventEmitter<any>();

  @Output() public removed = new EventEmitter<any>();

  public file!: File;

  public img$!: Observable<IFile | null>;

  public baseUrl = environment.baseUrl;

  private currentTaskId: string = '';

  public setImage!: File;

  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private projectModal: MatDialog,
    private userStatusService: UserStatusService,
    public tasksService: TasksDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.img$ = this.tasksService.getImg(this.task._id).pipe((value) => value);
  }

  updateTask() {
    const dialogData: ICreateEditModel = {
      title: 'Task-modal-edit-title',
      titleLabel: 'Task-modal-title',
      descriptionLabel: 'Task-modal-description',
      commandName: 'Task-modal-edit',
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

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((dialogResult) => {
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
              ),
              take(1)
            )
            .subscribe(() => this.edited.emit());
        }
      });
  }

  deleteTask() {
    const dialogData = new ConfirmDialogModel(
      'Task-modal-delete-title',
      'Task-modal-delete-message',
      'Delete'
    );

    const dialogRef = this.projectModal.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((dialogResult) => {
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
              ),
              take(1)
            )
            .subscribe(() => {
              this.removed.emit();
            });
        }
      });
  }

  setImg(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    if (!input.files) return;
    this.file = input.files[0];
    this.uploadImg();
  }

  uploadImg() {
    if (this.file) {
      const taskID = localStorage.getItem('currentTaskId') ?? '';
      const formData = new FormData();
      formData.append('boardId', this.task.boardId);
      formData.append('taskId', taskID);
      formData.append('file', this.file);
      this.tasksService.uploadImg(formData).subscribe(() => {
        localStorage.removeItem('currentTaskId');
        this.edited.emit();
      });
    } else {
      localStorage.setItem('currentTaskId', this.task._id);
    }
  }

  deleteImg(imgId: string) {
    this.tasksService.deleteImg(imgId).subscribe(() => this.edited.emit());
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
