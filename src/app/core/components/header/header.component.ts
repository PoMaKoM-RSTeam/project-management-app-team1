import { switchMap, map } from 'rxjs';
import { ProjectsDataService } from './../../services/projects-data.service';
import { ProjectCreateUpdateModalComponent } from './../../../shared/components/project-create-update-modal/project-create-update-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ICreateEditProject } from './../../models/dialog.model';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  currentLang = window.navigator.language.replace(/-.+/gsi, '');

  constructor(
    public translate: TranslateService,
    private projectModal: MatDialog,
    private projectsService: ProjectsDataService) {}

  ngOnInit() {
    this.translate.use(this.currentLang);
  }

  switchLang(lang:string) {
    if (this.currentLang === lang) {
      return;
    }
    this.currentLang = lang;
    this.translate.use(this.currentLang);
  }

  createProject() {
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
