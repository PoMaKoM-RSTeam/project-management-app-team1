import { BehaviorSubject, Observable, map } from 'rxjs';
import { IColumn, IError, TColumnInfo } from './../models/data.model';
import { Injectable } from '@angular/core';
import { ColumnApi } from './api/column.api';

@Injectable({
  providedIn: 'root',
})
export class ColumnsDataService {
  public columns: BehaviorSubject<IColumn[]> = new BehaviorSubject<IColumn[]>(
    []
  );

  getColumnsField(): Observable<IColumn[]> {
    return this.columns.asObservable();
  }

  constructor(private columnApi: ColumnApi) {}

  public updateColumn(
    boardId: string,
    columnId: string,
    columnInfo: TColumnInfo
  ): Observable<IColumn | IError | null> {
    return this.columnApi.updateColumn(boardId, columnId, columnInfo).pipe(
      map((result) => {
        if (result === null) {
          this.columnApi.getColumns(boardId).pipe(
            map((column) => {
              if (column) {
                const columns: IColumn[] = column as IColumn[];
                this.columns.next(columns);
              }
              return column as IColumn[];
            })
          );
        }
        return result;
      })
    );
  }

  public createColumn(
    title: string,
    order: number,
    boardId: string
  ): Observable<IColumn | IError | null> {
    return this.columnApi.createColumn(boardId, { title, order }).pipe(
      map((result) => {
        if (result === null) {
          this.columnApi.getColumns(boardId).pipe(
            map((column) => {
              if (column) {
                const columns: IColumn[] = column as IColumn[];
                this.columns.next(columns);
              }
              return column as IColumn[];
            })
          );
        }
        return result;
      })
    );
  }

  public getColumns(boardId: string): Observable<IColumn[]> {
    return this.columnApi.getColumns(boardId).pipe(
      map((result) => {
        if (result) {
          const columns: IColumn[] = result as IColumn[];
          this.columns.next(columns);
        }
        return result as IColumn[];
      })
    );
  }

  public deleteColumn(
    boardId: string,
    columnId: string
  ): Observable<IError | null> {
    return this.columnApi.deleteColumn(boardId, columnId).pipe(
      map((result) => {
        if (result === null) {
          this.columnApi.getColumns(boardId).pipe(
            map((column) => {
              if (column) {
                const columns: IColumn[] = column as IColumn[];
                this.columns.next(columns);
              }
              return column as IColumn[];
            })
          );
        }
        return result;
      })
    );
  }
}
