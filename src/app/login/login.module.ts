import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [{ path: '', component: LoginPageComponent }];

@NgModule({
  declarations: [LoginPageComponent, SignupComponent, LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class LoginModule {}
