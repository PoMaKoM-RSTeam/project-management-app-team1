import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { UserStatusService } from 'src/app/core/services/user-status.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  public isLogin$!: Observable<boolean>;

  public isSignup: boolean = false;

  constructor(
    private title: Title,
    private userStatusService: UserStatusService
  ) {}

  ngOnInit(): void {
    this.isLogin$ = this.userStatusService.getLogStatus();
    this.title.setTitle('Login');
  }

  public showForm(showLogin: boolean) {
    if (showLogin) {
      this.isSignup = false;
      this.title.setTitle('Login');
    } else {
      this.isSignup = true;
      this.title.setTitle('Signup');
    }
  }
}
