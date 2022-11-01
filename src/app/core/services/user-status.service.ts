import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IUserCredentials, LocalStorageKeys } from '../models/user.model';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  public isLogged: BehaviorSubject<boolean> = this.token
    ? new BehaviorSubject<boolean>(true)
    : new BehaviorSubject<boolean>(false);

  constructor(private database: DatabaseService, private rout: Router) {
    this.init();
  }

  init(): void {
    if (this.token) {
      this.isLogged.next(true);
    } else {
      this.isLogged.next(false);
    }
  }

  getLogStatus(): Observable<boolean> {
    return this.isLogged.asObservable();
  }

  get token(): string {
    return localStorage.getItem(LocalStorageKeys.authToken) ?? '';
  }

  get userId(): string {
    return localStorage.getItem(LocalStorageKeys.userId) ?? '';
  }

  get userLogin(): string {
    return localStorage.getItem(LocalStorageKeys.login) ?? '';
  }

  get userName$(): Observable<string> {
    return this.database.getUsers().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return (
            data.find((user) => {
              return user.id === this.userId;
            })?.name ?? ''
          );
        }
        return '';
      })
    );
  }

  logOut() {
    localStorage.removeItem(LocalStorageKeys.authToken);
    localStorage.removeItem(LocalStorageKeys.userId);
    localStorage.removeItem(LocalStorageKeys.login);
    this.isLogged.next(false);
    this.rout.navigate(['login']).then();
  }

  update(id: string, userInfo: IUserCredentials) {
    const subs = this.database.updateUser(id, userInfo).subscribe(() => {
      subs.unsubscribe();
    });
  }

  delete(id: string) {
    const subs = this.database.deleteUser(id).subscribe(() => {
      subs.unsubscribe();
    });
  }
}
