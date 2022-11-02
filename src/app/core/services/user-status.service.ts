import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { IError } from '../models/data.model';
import {
  IUser,
  IUserCredentials,
  LocalStorageKeys,
} from '../models/user.model';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  public isLogged: BehaviorSubject<boolean> = this.token
    ? new BehaviorSubject<boolean>(true)
    : new BehaviorSubject<boolean>(false);

  constructor(private database: DatabaseService, private router: Router) {
    this.init();
  }

  private init(): void {
    if (this.token) {
      this.isLogged.next(true);
    } else {
      this.isLogged.next(false);
    }
  }

  getLogStatus(): Observable<boolean> {
    return this.isLogged.asObservable();
  }

  getUserName(): Observable<string> {
    return of(this.userName);
  }

  getUserLogin(): Observable<string> {
    return of(this.userLogin);
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

  get userNameFromDatabase$(): Observable<string> {
    return this.database.getUsers().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          let userName =
            data.find((user) => {
              return user.id === this.userId;
            })?.name ?? '';
          localStorage.setItem(LocalStorageKeys.userName, userName);
          return userName;
        }
        return '';
      })
    );
  }

  get userNameFromDB$(): Observable<string> {
    return this.database.getUser(this.userId).pipe(
      map((data) => {
        let currentUser = '';
        if (data) {
          let currUser: IUser = data as IUser;
          currentUser = currUser.name;
          localStorage.setItem(LocalStorageKeys.userName, currUser.name);
        }
        return currentUser;
      })
    );
  }

  public logOut() {
    localStorage.removeItem(LocalStorageKeys.authToken);
    localStorage.removeItem(LocalStorageKeys.userId);
    localStorage.removeItem(LocalStorageKeys.userName);
    localStorage.removeItem(LocalStorageKeys.login);
    this.isLogged.next(false);
    this.router.navigate(['login']).then();
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
}
