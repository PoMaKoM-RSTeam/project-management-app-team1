import { Router } from '@angular/router';
import { switchMap, map, Observable } from 'rxjs';
import { ProjectsDataService } from './../../services/projects-data.service';
import { ProjectCreateUpdateModalComponent } from './../../../shared/components/project-create-update-modal/project-create-update-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ICreateEditProject } from './../../models/dialog.model';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserStatusService } from '../../services/user-status.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  currentLang = window.navigator.language.replace(/-.+/gis, '');

  public isLogged$!: Observable<boolean>;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private projectModal: MatDialog,
    private projectsService: ProjectsDataService,
    private userStatusService: UserStatusService
  ) {}

  ngOnInit() {
    this.translate.use(this.currentLang);
    this.isLogged$ = this.userStatusService.getLoginStatus();
  }

  switchLang(lang: string) {
    if (this.currentLang === lang) {
      return;
    }
    this.currentLang = lang;
    this.translate.use(this.currentLang);
  }

  createProject() {
    this.router.navigate(['home']);
    const dialogData: ICreateEditProject = {
      title:'Project-modal-add-title',
      projectTitleLabel:'Project-modal-title',
      projectDescriptionLabel:'Project-modal-description',
      commandName:'Project-modal-add',
    };


    const dialogRef = this.projectModal.open(ProjectCreateUpdateModalComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.projectsService.createProject(dialogResult[0], dialogResult[1]).pipe(
          switchMap(()=>this.projectsService.getProjects().pipe(map((value)=>value)))
        ).subscribe();
      }
    });
  }
}
