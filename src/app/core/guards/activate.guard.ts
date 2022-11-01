import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserStatusService } from '../services/user-status.service';

@Injectable({
  providedIn: 'root',
})
export class ActivateGuard implements CanActivate {
  constructor(
    private userStatusService: UserStatusService,
    private router: Router
  ) {}

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

    if (!this.userStatusService.isLogged) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
