import { Component, EventEmitter, Output } from '@angular/core';
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

  public authErrorMessage: string = '';

  signupForm: FormGroup;

  constructor(private authService: AuthService) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.email, Validators.required]),
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
    this.authErrorMessage = '';
    const subs = this.authService
      .signUp({
        name: this.name?.value,
        login: this.login?.value,
        password: this.password?.value,
      })
      .subscribe({
        next: () => {
          this.signin();
        },
        error: (error: string) => {
          this.authErrorMessage =
            Number(error) === 409 ? 'User already registered' : error;
          subs.unsubscribe();
        },
      });
  }

  get name(): AbstractControl | null {
    return this.signupForm.get('name');
  }

  get login(): AbstractControl | null {
    return this.signupForm.get('login');
  }

  get password(): AbstractControl | null {
    return this.signupForm.get('password');
  }

  public signin(): void {
    this.showSignin.emit();
  }
}
