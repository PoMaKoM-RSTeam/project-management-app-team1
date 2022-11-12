import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser, IUserCredentials, TUserSignIn } from '../models/user.model';
import {
  IBoard,
  IBoardComplete,
  IColumn,
  IColumnComplete,
  IError,
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

  public deleteUser(id: string): Observable<IError | null> {
    return this.http.delete<IError | null>(`api/users/${id}`);
  }

  public updateUser(
    id: string,
    credentials: IUserCredentials
  ): Observable<IError | IUser> {
    return this.http.put<IError | IUser>(`api/users/${id}`, credentials);
  }

  public getBoards(): Observable<IError | IBoard[]> {
    return this.http.get<IError | IBoard[]>('api/boards');
  }

  public createBoard(boardInfo: TBoardInfo): Observable<IError | null> {
    return this.http.post<IError | null>('api/boards', boardInfo);
  }

  public getBoard(id: string): Observable<IError | IBoardComplete> {
    return this.http.get<IError | IBoardComplete>(`api/boards/${id}`);
  }

  public deleteBoard(id: string): Observable<IError | null> {
    return this.http.delete<IError | null>(`api/boards/${id}`);
  }

  public updateBoard(
    id: string,
    boardInfo: TBoardInfo
  ): Observable<IError | IBoard> {
    return this.http.put<IError | IBoard>(`api/boards/${id}`, boardInfo);
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

  public getColumn(
    boardId: string,
    columnId: string
  ): Observable<IError | IColumnComplete> {
    return this.http.get<IError | IColumnComplete>(
      `api/boards/${boardId}/columns/${columnId}`
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

  public getTask(
    boardId: string,
    columnId: string,
    taskId: string
  ): Observable<IError | ITask> {
    return this.http.get<IError | ITask>(
      `api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`
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
}
