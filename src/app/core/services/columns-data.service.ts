import { BehaviorSubject, Observable, map } from 'rxjs';
import { IColumn, IError } from './../models/data.model';
import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColumnsDataService {
  public columns: BehaviorSubject<IColumn[]> = new BehaviorSubject<IColumn[]>(
    []
  );

  getColumnsField(): Observable<IColumn[]> {
    return this.columns.asObservable();
  }

  constructor(private database: DatabaseService) {}

  public createColumn(
    title: string,
    order: number,
    boardId: string
  ): Observable<IColumn | IError | null> {
    return this.database.createColumn(boardId, { title, order }).pipe(
      map((result) => {
        if (result === null) {
          this.database.getColumns(boardId).pipe(
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
    return this.database.getColumns(boardId).pipe(
      map((result) => {
        if (result) {
          const columns: IColumn[] = result as IColumn[];
          this.columns.next(columns);
        }
        return result as IColumn[];
      })
    );
  }

  public deleteColumn(boardId: string, columnId: string): Observable<IError | null> {
    return this.database.deleteColumn(boardId, columnId).pipe(
      map((result) => {
        if (result === null) {
          this.database.getColumns(boardId).pipe(
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
