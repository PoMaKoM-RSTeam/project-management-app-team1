import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { IUser, IUserCredentials, TUserSignIn } from '../../models/user.model';
import { IError, ITokenResponse } from '../../models/data.model';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
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

  public updateUser(
    id: string,
    credentials: IUserCredentials
  ): Observable<IError | IUser> {
    return this.http.put<IError | IUser>(`api/users/${id}`, credentials);
  }

  public deleteUser(id: string): Observable<IError | null> {
    return this.http.delete<IError | null>(`api/users/${id}`);
  }
}
