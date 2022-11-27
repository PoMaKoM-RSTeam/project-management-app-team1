import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import {
  IBoard,
  IBoardComplete,
  IError,
  TBoardInfo,
} from '../../models/data.model';

@Injectable({
  providedIn: 'root',
})
export class BoardApi {
  constructor(private http: HttpClient) {}

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
}
