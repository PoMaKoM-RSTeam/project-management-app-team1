import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserStatusService } from '../../services/user-status.service';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserStatusComponent implements OnInit {
  public isLogged$!: Observable<boolean>;

  public isLoginPage!: boolean;

  public userName$!: Observable<string>;

  constructor(
    private router: Router,
    private userStatusService: UserStatusService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLogged$ = this.userStatusService.getLogStatus();

    this.isLoginPage = this.router.url === '/login';

    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.isLoginPage = e.url === '/login';
        this.cdr.detectChanges();
      }
    });

    this.userName$ = this.userStatusService.getUserName();
  }

  public logout(): void {
    this.userStatusService.logOut();
  }
}
