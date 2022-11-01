import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserStatusService } from '../services/user-status.service';

@Injectable({
  providedIn: 'root',
})
export class LoadGuard implements CanLoad {
  constructor(
    private userStatusService: UserStatusService,
    private router: Router
  ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    route.toString();
    segments.toString();

    if (!this.userStatusService.isLogged) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
