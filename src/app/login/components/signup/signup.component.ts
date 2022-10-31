import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StringValidators } from 'src/app/core/validators/string.validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  @Output() public showSignin = new EventEmitter();

  loginForm: FormGroup;

  constructor(private router: Router, private auth: AuthService) {
    this.loginForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      login: new FormControl('', [
        StringValidators.leastOneSpecChar(),
        StringValidators.lowerAndUpperCase(),
        StringValidators.lettersAndNumbers(),
        Validators.minLength(8),
        Validators.required,
      ]),
      password: new FormControl('', [
        StringValidators.leastOneSpecChar(),
        StringValidators.lowerAndUpperCase(),
        StringValidators.lettersAndNumbers(),
        Validators.minLength(8),
        Validators.required,
      ]),
    });
  }

  authorize(): void {
    this.auth.signup({
      name: this.name?.value,
      login: this.login?.value,
      password: this.password?.value,
    });
    this.router.navigate(['/auth/login']).then();
  }

  get name(): AbstractControl | null {
    return this.loginForm.get('name');
  }

  get login(): AbstractControl | null {
    return this.loginForm.get('login');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  public signin(): void {
    this.showSignin.emit();
  }

  haveValidationErrors(): boolean {
    return !(this.login?.errors === null && this.password?.errors === null);
  }
}
