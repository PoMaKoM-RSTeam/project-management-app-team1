import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StringValidators } from '../../../core/validators/string.validators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  @Output() public showSignup = new EventEmitter();

  public authForm: FormGroup;

  public loginErrorMessage: string = '';

  public hide: boolean = true;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.authForm = this.fb.group({
      login: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          StringValidators.leastOneSpecChar(),
          StringValidators.lowerAndUpperCase(),
          StringValidators.lettersAndNumbers(),
          Validators.minLength(8),
          Validators.required,
        ],
      ],
    });
  }

  public signup(): void {
    this.showSignup.emit();
  }

  public onSubmit(): void {
    this.loginErrorMessage = '';
    const subs = this.authService
      .logIn({
        login: this.authForm.controls['login'].value,
        password: this.authForm.controls['password'].value,
      })
      .subscribe({
        error: (error: string) => {
          this.loginErrorMessage =
            Number(error) === 403 ? 'User not found' : error;
          subs.unsubscribe();
        },
      });
  }
}
