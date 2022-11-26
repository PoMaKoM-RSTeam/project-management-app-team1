import { TasksDataService } from './../../../core/services/tasks-data.service';
import { Observable, Subscription } from 'rxjs';
import { IFile, ITask } from './../../../core/models/data.model';
import { environment } from 'src/environments/environment';
import { IUser } from './../../../core/models/user.model';
import { ChangeDetectionStrategy, Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreateEditModel } from '../../../core/models/dialog.model';

@Component({
  selector: 'app-create-update-modal',
  templateUrl: './create-update-modal.component.html',
  styleUrls: ['./create-update-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUpdateModalComponent implements OnInit, OnDestroy {

  public baseUrl = environment.baseUrl;

  public img$!: Observable<IFile | null>;
  
  public file!: File;

  title: string;

  titleLabel!: string;

  titleField: string = '';

  descriptionLabel: string;

  usersLabel: string;

  descriptionField: string = '';

  commandName: string;

  users!: IUser[];

  user!: string;

  userName!: string;

  task!: ITask;

  sub!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<CreateUpdateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dialog: ICreateEditModel,
    public tasksService: TasksDataService
  ) {
    this.title = dialog.title;
    this.titleLabel = dialog.titleLabel;
    this.descriptionLabel = dialog.descriptionLabel ?? '';
    this.commandName = dialog.commandName;
    this.titleField = dialog.titleField ?? '';
    this.descriptionField = dialog.descriptionField ?? '';
    this.usersLabel = dialog.usersLabel ?? '';
    this.userName = dialog.user ?? '';
    this.users = dialog.users ?? [];
    this.task = dialog.task!;
  }

  ngOnInit(): void {
    if (this.task) {
      this.img$ = this.tasksService.getImg(this.task._id).pipe((value) => value);
    }
    
  }

  onCommand(): void {
    this.dialogRef.close([
      this.titleField,
      this.descriptionField,
      this.userName,
    ]);
  }

  onCancel(): void {
    this.dialogRef.close(false);
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
      });
      this.img$ = this.tasksService.getImg(this.task._id).pipe((value) => value);
      this.sub = this.img$.subscribe((value) => {console.log(value);});
    } else {
      localStorage.setItem('currentTaskId', this.task._id);
      this.img$ = this.tasksService.getImg(this.task._id).pipe((value) => value);
      this.sub = this.img$.subscribe((value) => {console.log(value);});
      
    }
  }

  deleteImg(imgId: string) {
    this.tasksService.deleteImg(imgId).subscribe();
    this.img$ = this.tasksService.getImg(this.task._id).pipe((value) => value);
    this.sub = this.img$.subscribe((value) => value);
  }

  ngOnDestroy(): void {
    if (this.task) {
      this.sub.unsubscribe();
    }
  }
}
