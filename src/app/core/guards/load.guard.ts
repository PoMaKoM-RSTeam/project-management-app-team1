import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserStatusService } from '../services/user-status.service';

@Injectable({
  providedIn: 'root',
})
export class LoadGuard implements CanLoad {
  constructor(private userStatusService: UserStatusService) {}

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

    if (!this.userStatusService.isAuthenticated()) {
      return false;
    }
    return true;
  }
}
