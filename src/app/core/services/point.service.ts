import { IPoint, IError, IPointInfo } from './../models/data.model';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { PointApi } from './api/point.api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PointService {

  public points: BehaviorSubject<IPoint[]> = new BehaviorSubject<IPoint[]>([]);

  constructor(private pointApi: PointApi) { }

  public createPoint(
    pointInfo: IPointInfo
  ): Observable<IPoint | IError | null> {
    return this.pointApi.createPoint(pointInfo).pipe(
      map((result) => {
        if (result === null) {
          this.pointApi.getPointsByTaskId(pointInfo.taskId).pipe(value => value);
        }
        return result;
      })
    );
  }

  public updatePoint(
    pointId: string,
    pointStatus: boolean,
  ): Observable<IPoint | IError> {
    return this.pointApi
      .updatePoint(pointId, pointStatus)
      .pipe(map((result) => {
        return result as IPoint;
      }));
  }

  public getPointByTaskId(taskId: string): Observable<IPoint[] | IError> {
    return this.pointApi.getPointsByTaskId(taskId).pipe(value => value);
  }
}
