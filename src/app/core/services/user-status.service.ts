import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IError } from '../models/data.model';
import {
  ITokenInfo,
  IUser,
  IUserCredentials,
  LocalStorageKeys,
} from '../models/user.model';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  public isLogged: BehaviorSubject<boolean> = this.isAuthenticated()
    ? new BehaviorSubject<boolean>(true)
    : new BehaviorSubject<boolean>(false);

  public isSignup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public UserName: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.userName
  );

  public Login: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.userLogin
  );

  public users: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>(
    []
  );

  constructor(private database: DatabaseService, private router: Router) {
    this.isLogged.next(this.isAuthenticated());
  }

  getLoginStatus(): Observable<boolean> {
    return this.isLogged.asObservable();
  }

  getSignupStatus(): Observable<boolean> {
    return this.isSignup.asObservable();
  }

  getUserName(): Observable<string> {
    return this.UserName.asObservable();
  }

  getUserLogin(): Observable<string> {
    return this.Login.asObservable();
  }

  getUsers(): Observable<IUser[]> {
    return this.users.asObservable();
  }

  get token(): string {
    return localStorage.getItem(LocalStorageKeys.authToken) ?? '';
  }

  get userId(): string {
    return localStorage.getItem(LocalStorageKeys.userId) ?? '';
  }

  get userName(): string {
    return localStorage.getItem(LocalStorageKeys.userName) ?? '';
  }

  get userLogin(): string {
    return localStorage.getItem(LocalStorageKeys.login) ?? '';
  }

  public setSignup(set: boolean) {
    this.isSignup.next(set);
  }

  public logOut() {
    localStorage.removeItem(LocalStorageKeys.authToken);
    localStorage.removeItem(LocalStorageKeys.userId);
    localStorage.removeItem(LocalStorageKeys.userName);
    localStorage.removeItem(LocalStorageKeys.login);
    this.isLogged.next(false);
    this.router.navigate(['login']);
  }

  public updateUser(userInfo: IUserCredentials): Observable<IError | IUser> {
    return this.database.updateUser(this.userId, userInfo).pipe(
      map((result) => {
        if (result) {
          const user: IUser = result as IUser;
          localStorage.setItem(LocalStorageKeys.userName, user.name);
          localStorage.setItem(LocalStorageKeys.login, user.login);
        }
        return result;
      })
    );
  }

  public getAllUsers(): Observable<IError | IUser[]> {
    return this.database.getUsers().pipe(
      map((result) => {
        if (result) {
          const users: IUser[] = result as IUser[];
          this.users.next(users);
        }
        return result as IUser[];
      })
    );
  }

  public deleteUser(): Observable<IError | null> {
    return this.database.deleteUser(this.userId).pipe(
      map((result) => {
        if (null) {
          this.logOut();
        }
        return result;
      })
    );
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(LocalStorageKeys.authToken);
    if (token) {
      try {
        const { exp } = this.parseJwt(token) as ITokenInfo;
        return Date.now() <= exp * 1000;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  }

  public parseJwt(token: string): ITokenInfo {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
