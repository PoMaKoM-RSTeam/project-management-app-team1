import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { IError, IPoint, IPointInfo } from '../../models/data.model';

@Injectable({
  providedIn: 'root',
})
export class PointApi {
  constructor(private http: HttpClient) {}

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
    pointStatus: boolean
  ): Observable<IError | IPoint> {
    return this.http.patch<IPoint>(`api/points/${id}`, { title:'Point', done: pointStatus });
  }

  public updateSetOfPoints(points: IPoint[]): Observable<IError | IPoint[]> {
    return this.http.patch<IPoint[]>('api/points', { points });
  }

  public deletePoint(id: string): Observable<IError | IPoint> {
    return this.http.delete<IPoint>(`api/points/${id}`);
  }
}
