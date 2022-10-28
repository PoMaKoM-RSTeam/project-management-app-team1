import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  public isLogin$!: Observable<boolean>;

  public isSignup$!: Observable<boolean>;
}
