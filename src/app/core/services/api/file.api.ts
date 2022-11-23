import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { IError, IFile } from '../../models/data.model';

@Injectable({
  providedIn: 'root',
})
export class FileApi {
  constructor(private http: HttpClient) {}

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
