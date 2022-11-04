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
  private currentLang = 'en';

  constructor(public translate: TranslateService,
    private projectModal: MatDialog) {}

  switchLang() {
    this.currentLang = this.currentLang === 'en' ? 'ru' : 'en';
    this.translate.use(this.currentLang);
  }

  createProject() {
    const dialogData: ICreateEditProject = {
      title:'Project-modal-add-title',
      projectTitleLabel:'Project-modal-title',
      projectDescriptionLabel:'Project-modal-description',
      commandName:'Project-modal-add'
    };


    const dialogRef = this.projectModal.open(ProjectCreateUpdateModalComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        
      }
    });
  }
}
