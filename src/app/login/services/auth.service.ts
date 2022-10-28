import { Injectable } from '@angular/core';
import { ILogin } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public logIn(userLogin: ILogin): void {
    localStorage.setItem('token', JSON.stringify(userLogin));
  }
}
