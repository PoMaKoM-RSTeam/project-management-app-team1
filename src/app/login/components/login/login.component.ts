import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StringValidators } from '../../../core/validators/string.validators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Output() public showSignup = new EventEmitter();

  public authForm: FormGroup;

  public hide: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.authForm = this.fb.group({
      login: ['user@project.test', [Validators.required, Validators.email]],
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
    this.authService.logIn({
      login: this.authForm.controls['login'].value,
      password: this.authForm.controls['password'].value,
    });

    this.router.navigate(['']);
  }
}
