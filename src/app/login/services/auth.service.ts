import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
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
      map<IError | ITokenResponse, string>((data) => {
        let userId = '';
        if ('token' in data) {
          const tokenInfo: ITokenInfo = this.userStatusService.parseJwt(
            data.token
          );
          localStorage.setItem(LocalStorageKeys.authToken, data.token);
          localStorage.setItem(LocalStorageKeys.userId, tokenInfo.id);
          localStorage.setItem(LocalStorageKeys.login, tokenInfo.login);
          this.userStatusService.isLogged.next(true);
          userId = tokenInfo.id;
        }
        return userId;
      }),
      switchMap((userId: string) => {
        return this.getUserNameFromDB(userId).pipe(
          map((name: string) => {
            this.userStatusService.UserName.next(name);
            this.router.navigate(['home']);
          })
        );
      })
    );
  }

  private getUserNameFromDB(userId: string): Observable<string> {
    return this.database.getUser(userId).pipe(
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

  public signUp(credentials: IUserCredentials) {
    return this.database.signUp(credentials).pipe(
      map<IError | IUser, void>((data) => {
        if ('_id' in data) {
          this.router.navigate(['login']);
        }
      })
    );
  }
}
