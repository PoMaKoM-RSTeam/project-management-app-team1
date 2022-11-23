import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import {
  IError,
  ITask,
  TTaskInfo,
  TTaskInfoExtended,
} from '../../models/data.model';

@Injectable({
  providedIn: 'root',
})
export class TaskApi {
  constructor(private http: HttpClient) {}

  public getTask(
    boardId: string,
    columnId: string,
    taskId: string
  ): Observable<IError | ITask> {
    return this.http.get<IError | ITask>(
      `api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`
    );
  }

  public getTasks(
    boardId: string,
    columnId: string
  ): Observable<IError | ITask[]> {
    return this.http.get<IError | ITask[]>(
      `api/boards/${boardId}/columns/${columnId}/tasks`
    );
  }

  public createTask(
    boardId: string,
    columnId: string,
    taskInfo: TTaskInfo
  ): Observable<IError | ITask> {
    return this.http.post<IError | ITask>(
      `api/boards/${boardId}/columns/${columnId}/tasks`,
      taskInfo
    );
  }

  public updateTask(
    boardId: string,
    columnId: string,
    taskId: string,
    taskInfo: TTaskInfoExtended
  ): Observable<IError | ITask> {
    return this.http.put<IError | ITask>(
      `api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
      taskInfo
    );
  }

  public deleteTask(
    boardId: string,
    columnId: string,
    taskId: string
  ): Observable<IError | null> {
    return this.http.delete<IError | null>(
      `api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`
    );
  }

  public getTasksByUser(userId: string): Observable<ITask[]> {
    return this.http.get<ITask[]>('api/tasksSet', {
      params: { userId: userId },
    });
  }

  public getTasksByIds(ids: string[]): Observable<ITask[]> {
    return this.http.get<ITask[]>('api/tasksSet', {
      params: { ids: ids.join(', ') },
    });
  }

  public getTasksByBoardId(boardId: string): Observable<ITask[]> {
    return this.http.get<ITask[]>(`api/tasksSet/${boardId}`);
  }

  public updateSetOfTasks(tasks: ITask[]): Observable<ITask[]> {
    return this.http.patch<ITask[]>('api/tasksSet', { tasks });
  }
}
