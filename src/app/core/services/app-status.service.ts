import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IError } from '../models/data.model';
import { IUser } from '../models/user.model';
import { UserApi } from './api/user.api';

@Injectable({
  providedIn: 'root',
})
export class AppStatusService {
  public currentLang: BehaviorSubject<string> = new BehaviorSubject<string>(
    window.navigator.language.replace(/-.+/gis, '')
  );

  public Users: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);

  constructor(private userApi: UserApi, private router: Router) {
    this.getAllUsers().pipe((value) => value);
  }

  getCurrentLang(): Observable<string> {
    return this.currentLang.asObservable();
  }

  getUsers(): Observable<IUser[]> {
    return this.Users.asObservable();
  }

  public getAllUsers(): Observable<IError | IUser[]> {
    return this.userApi.getUsers().pipe(
      map((result) => {
        if (result) {
          const users: IUser[] = result as IUser[];
          this.Users.next(users);
        }
        return result as IUser[];
      })
    );
  }
}
