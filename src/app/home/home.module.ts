import { CoreModule } from './../core/core.module';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { HomePageComponent } from './pages/home/home-page.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectPreviewComponent } from './components/project-preview/project-preview.component';

const routes: Routes = [{ path: '', component: HomePageComponent }];
@NgModule({
  declarations: [HomePageComponent, ProjectListComponent, ProjectPreviewComponent],
  imports: [
    CommonModule,
    CoreModule,
    MatIconModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class HomeModule {}
