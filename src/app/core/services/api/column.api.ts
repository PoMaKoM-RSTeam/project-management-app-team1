import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import {
  IColumn,
  IColumnComplete,
  IError,
  TColumnInfo,
} from '../../models/data.model';

@Injectable({
  providedIn: 'root',
})
export class ColumnApi {
  constructor(private http: HttpClient) {}

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
}
