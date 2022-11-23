import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser, IUserCredentials, TUserSignIn } from '../models/user.model';
import {
  IBoard,
  IBoardComplete,
  IColumn,
  IColumnComplete,
  IError,
  IFile,
  IPoint,
  IPointInfo,
  ITask,
  ITokenResponse,
  TBoardInfo,
  TColumnInfo,
  TTaskInfo,
  TTaskInfoExtended,
} from '../models/data.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  /***
      USER API
  */

  public signUp(credentials: IUserCredentials): Observable<IError | IUser> {
    return this.http.post<IError | IUser>('api/auth/signup', credentials);
  }

  public signIn(loginInfo: TUserSignIn): Observable<IError | ITokenResponse> {
    return this.http.post<IError | ITokenResponse>(
      'api/auth/signin',
      loginInfo
    );
  }

  public getUsers(): Observable<IError | IUser[]> {
    return this.http.get<IError | IUser[]>('api/users');
  }

  public getUser(id: string): Observable<IError | IUser> {
    return this.http.get<IError | IUser>(`api/users/${id}`);
  }

  public updateUser(
    id: string,
    credentials: IUserCredentials
  ): Observable<IError | IUser> {
    return this.http.put<IError | IUser>(`api/users/${id}`, credentials);
  }

  public deleteUser(id: string): Observable<IError | null> {
    return this.http.delete<IError | null>(`api/users/${id}`);
  }

  /***
      BOARD API
  */

  public getBoard(id: string): Observable<IError | IBoardComplete> {
    return this.http.get<IError | IBoardComplete>(`api/boards/${id}`);
  }

  public getBoards(): Observable<IError | IBoard[]> {
    return this.http.get<IError | IBoard[]>('api/boards');
  }

  public createBoard(
    boardInfo: TBoardInfo
  ): Observable<IBoard | IError | null> {
    return this.http.post<IBoard | IError | null>('api/boards', boardInfo);
  }

  public updateBoard(
    id: string,
    boardInfo: TBoardInfo
  ): Observable<IError | IBoard> {
    return this.http.put<IError | IBoard>(`api/boards/${id}`, boardInfo);
  }

  public deleteBoard(id: string): Observable<IError | null> {
    return this.http.delete<IError | null>(`api/boards/${id}`);
  }

  /***
      COLUMN API
  */

  public getColumn(
    boardId: string,
    columnId: string
  ): Observable<IError | IColumnComplete> {
    return this.http.get<IError | IColumnComplete>(
      `api/boards/${boardId}/columns/${columnId}`
    );
  }

  public getColumns(boardId: string): Observable<IError | IColumn[]> {
    return this.http.get<IError | IColumn[]>(`api/boards/${boardId}/columns`);
  }

  public createColumn(
    boardId: string,
    columnInfo: TColumnInfo
  ): Observable<IError | IColumn> {
    return this.http.post<IError | IColumn>(
      `api/boards/${boardId}/columns`,
      columnInfo
    );
  }

  public updateColumn(
    boardId: string,
    columnId: string,
    columnInfo: TColumnInfo
  ): Observable<IError | IColumn> {
    return this.http.put<IError | IColumn>(
      `api/boards/${boardId}/columns/${columnId}`,
      columnInfo
    );
  }

  public deleteColumn(
    boardId: string,
    columnId: string
  ): Observable<IError | null> {
    return this.http.delete<IError | null>(
      `api/boards/${boardId}/columns/${columnId}`
    );
  }

  /***
      TASK API
  */

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

  /***
      POINT API
  */

  public getPointsByUser(userId: string): Observable<IError | IPoint[]> {
    return this.http.get<IPoint[]>('api/points', {
      params: { userId: userId },
    });
  }

  public getPointsByIds(pointIds: string[]): Observable<IError | IPoint[]> {
    return this.http.get<IPoint[]>('api/points', {
      params: { ids: pointIds.join(', ') },
    });
  }

  public getPointsByTaskId(taskId: string): Observable<IError | IPoint[]> {
    return this.http.get<IPoint[]>(`api/points/${taskId}`);
  }

  public createPoint(pointInfo: IPointInfo): Observable<IError | IPoint> {
    return this.http.post<IPoint>('api/points', pointInfo);
  }

  public updatePoint(
    id: string,
    pointInfo: IPointInfo
  ): Observable<IError | IPoint> {
    return this.http.patch<IPoint>(`api/points/${id}`, pointInfo);
  }

  public updateSetOfPoints(points: IPoint[]): Observable<IError | IPoint[]> {
    return this.http.patch<IPoint[]>('api/points', { points });
  }

  public deletePoint(id: string): Observable<IError | IPoint> {
    return this.http.delete<IPoint>(`api/points/${id}`);
  }

  /***
      FILE API
  */

  public getFilesByIds(ids: string[]): Observable<IFile[] | null> {
    return this.http.get<IFile[]>('api/file', {
      params: { ids: ids.join(', ') },
    });
  }

  public getFilesByUserId(userId: string): Observable<IFile[] | null> {
    return this.http.get<IFile[]>('api/file', { params: { userId: userId } });
  }

  public getFilesByBoardId(boardId: string): Observable<IFile[] | null> {
    return this.http.get<IFile[]>(`api/file/${boardId}`);
  }

  public getFilesByTaskId(taskId: string): Observable<IFile[] | null> {
    return this.http.get<IFile[]>('api/file', { params: { taskId: taskId } });
  }

  public uploadFile(data: FormData): Observable<IFile | IError> {
    return this.http.post<IFile | IError>('api/file', data, {
      headers: { Accept: 'multipart/form-data' },
    });
  }

  public deleteFile(id: string): Observable<IError | IFile> {
    return this.http.delete<IFile>(`api/file/${id}`);
  }
}
