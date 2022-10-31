import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  ILogin,
  IUserCredentials,
  TUserSignIn,
  ITokenInfo,
  LocalStorageKeys,
} from '../../core/models/user.model';
import { IError, ITokenResponse } from '../../core/models/data.model';
import { DatabaseService } from 'src/app/core/services/database.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public logIn(userLogin: ILogin): void {
    localStorage.setItem('token', JSON.stringify(userLogin));
  }

  isLogged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private database: DatabaseService, private rout: Router) {
    this.init();
  }

  init(): void {
    if (this.token) {
      this.isLogged$.next(true);
    } else {
      this.isLogged$.next(false);
    }
  }

  getLogStatus(): Observable<boolean> {
    return this.isLogged$.asObservable();
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

  logout() {
    localStorage.removeItem(LocalStorageKeys.authToken);
    localStorage.removeItem(LocalStorageKeys.userId);
    localStorage.removeItem(LocalStorageKeys.login);
    this.isLogged$.next(false);
    this.rout.navigate(['/start']).then();
  }

  login(userData: TUserSignIn) {
    return this.database.signIn(userData).pipe(
      map<IError | ITokenResponse, void>((data) => {
        if ('token' in data) {
          localStorage.setItem(LocalStorageKeys.authToken, data.token);
          const [id, login] = [...this.decodeToken(data.token)];
          localStorage.setItem(LocalStorageKeys.userId, id);
          localStorage.setItem(LocalStorageKeys.login, login);
          this.isLogged$.next(true);
        }
      })
    );
  }

  decodeToken(token: string): string[] {
    let id = '';
    let login = '';
    try {
      const tokenInfo: ITokenInfo = JSON.parse(atob(token.split('.')[1]));
      id = tokenInfo.userId;
      login = tokenInfo.login;
    } catch (e) {
      console.log(e);
    }
    return [id, login];
  }

  signup(credentials: IUserCredentials) {
    const subs = this.database.signUp(credentials).subscribe(() => {
      subs.unsubscribe();
    });
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
