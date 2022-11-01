import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import {
  IUserCredentials,
  TUserSignIn,
  ITokenInfo,
  LocalStorageKeys,
  IUser,
} from '../../core/models/user.model';
import { IError, ITokenResponse } from '../../core/models/data.model';
import { DatabaseService } from 'src/app/core/services/database.service';
import { UserStatusService } from 'src/app/core/services/user-status.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private database: DatabaseService,
    private router: Router,
    private userStatusService: UserStatusService
  ) {}

  public logIn(userData: TUserSignIn) {
    return this.database.signIn(userData).pipe(
      map<IError | ITokenResponse, void>((data) => {
        if ('token' in data) {
          localStorage.setItem(LocalStorageKeys.authToken, data.token);
          const [id, login] = [...this.decodeToken(data.token)];
          localStorage.setItem(LocalStorageKeys.userId, id);
          localStorage.setItem(LocalStorageKeys.login, login);
          this.userStatusService.isLogged.next(true);
          this.router.navigate(['home']).then();
        }
      })
    );
  }

  public signUp(credentials: IUserCredentials) {
    return this.database.signUp(credentials).pipe(
      map<IError | IUser, void>((data) => {
        if ('id' in data) {
          this.router.navigate(['login']).then();
        }
      })
    );
  }

  private decodeToken(token: string): string[] {
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
}
