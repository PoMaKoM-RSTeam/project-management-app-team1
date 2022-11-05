import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserStatusService } from '../services/user-status.service';

@Injectable({
  providedIn: 'root',
})
export class ActivateGuard implements CanActivate {
  constructor(private userStatusService: UserStatusService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    route.toString();
    state.toString();
    console.log('canActivate');
    if (!this.userStatusService.isAuthenticated()) {
      this.userStatusService.logOut();
      return false;
    }
    return true;
  }
}
