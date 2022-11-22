import {
  ITask,
  IError,
  TTaskInfoExtended,
  IFile,
} from './../models/data.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { DatabaseService } from 'src/app/core/services/database.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TasksDataService {
  public tasks: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>([]);

  public task!: BehaviorSubject<ITask>;

  getTasksField(): Observable<ITask[]> {
    return this.tasks.asObservable();
  }

  constructor(private database: DatabaseService) {}

  public createTask(
    title: string,
    description: string,
    order: number,
    columnId: string,
    boardId: string,
    userId: string,
    users: string[]
  ): Observable<ITask | IError | null> {
    return this.database
      .createTask(boardId, columnId, {
        title,
        description,
        order,
        userId,
        users,
      })
      .pipe(
        map((result) => {
          if (result === null) {
            this.database.getTasks(boardId, columnId).pipe(
              map((task) => {
                if (task) {
                  const tasks: ITask[] = task as ITask[];
                  this.tasks.next(tasks);
                }
                return task as ITask[];
              })
            );
          }
          return result;
        })
      );
  }

  public getTasks(boardId: string, columnId: string): Observable<ITask[]> {
    return this.database.getTasks(boardId, columnId).pipe(
      map((result) => {
        if (result) {
          const tasks: ITask[] = result as ITask[];
          this.tasks.next(tasks);
        }
        return result as ITask[];
      })
    );
  }

  public updateTask(
    boardId: string,
    columnId: string,
    taskId: string,
    taskInfo: TTaskInfoExtended
  ): Observable<ITask | IError | null> {
    return this.database.updateTask(boardId, columnId, taskId, taskInfo).pipe(
      map((result) => {
        if (result === null) {
          this.database.getTasks(boardId, columnId).pipe(
            map((task) => {
              if (task) {
                const tasks: ITask[] = task as ITask[];
                this.tasks.next(tasks);
              }
              return task as ITask[];
            })
          );
        }
        return result;
      })
    );
  }

  public getTask(
    boardId: string,
    columnId: string,
    taskId: string
  ): Observable<ITask> {
    return this.database.getTask(boardId, columnId, taskId).pipe(
      map((result) => {
        if (result) {
          const task: ITask = result as ITask;
          this.task.next(task);
        }
        return result as ITask;
      })
    );
  }

  public deleteTask(
    boardId: string,
    columnId: string,
    taskId: string
  ): Observable<IError | null> {
    return this.database.deleteTask(boardId, columnId, taskId).pipe(
      map((result) => {
        if (result === null) {
          this.database.getTasks(boardId, columnId).pipe(
            map((task) => {
              if (task) {
                const tasks: ITask[] = task as ITask[];
                this.tasks.next(tasks);
              }
              return task as ITask[];
            })
          );
        }
        return result;
      })
    );
  }

  public getImg(taskId: string): Observable<IFile | null> {
    return this.database.getFilesByTaskId(taskId).pipe(
      map((result) => {
        if (result && result[0]) {
          return result[0];
        }
        return null;
      })
    );
  }

  public uploadImg(formData: FormData): Observable<IFile | IError | null> {
    return this.database.uploadFile(formData).pipe((result) => result);
  }

  public deleteImg(imgId: string): Observable<IError | IFile> {
    return this.database.deleteFile(imgId).pipe((result) => result);
  }
}
