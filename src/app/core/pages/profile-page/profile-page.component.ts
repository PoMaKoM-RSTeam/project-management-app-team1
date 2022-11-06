import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from '../../models/dialog.model';
import { UserStatusService } from '../../services/user-status.service';
import { StringValidators } from '../../validators/string.validators';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  public updateErrorMessage: string = '';

  private destroy$ = new Subject<void>();

  profileForm: FormGroup;

  constructor(
    private title: Title,
    private router: Router,
    private dialog: MatDialog,
    private userStatusService: UserStatusService
  ) {
    this.profileForm = new FormGroup({
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

  ngOnInit(): void {
    this.title.setTitle('Profile');

    this.userStatusService
      .getUserName()
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (!val) {
          return;
        }
        setTimeout(() => {
          this.profileForm.controls['name'].setValue(val);
        });
      });

    this.userStatusService
      .getUserLogin()
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (!val) {
          return;
        }
        setTimeout(() => {
          this.profileForm.controls['login'].setValue(val);
        });
      });
  }

  updateProfile(): void {
    this.updateErrorMessage = '';
    const subs = this.userStatusService
      .updateUser({
        name: this.name?.value,
        login: this.login?.value,
        password: this.password?.value,
      })
      .subscribe({
        next: () => {
          this.updateErrorMessage = 'User updated';
        },
        error: (error: string) => {
          this.updateErrorMessage =
            Number(error) === 409 ? 'User already updated' : error;
          subs.unsubscribe();
        },
      });
  }

  deleteUser() {
    const dialogData = new ConfirmDialogModel(
      'Profile-user-delete-title',
      'Profile-user-delete-message',
      'Delete'
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.userStatusService.deleteUser().subscribe({
          next: () => {
            this.router.navigate(['login']);
          },
        });
      }
    });
  }

  get name(): AbstractControl | null {
    return this.profileForm.get('name');
  }

  get login(): AbstractControl | null {
    return this.profileForm.get('login');
  }

  get password(): AbstractControl | null {
    return this.profileForm.get('password');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
