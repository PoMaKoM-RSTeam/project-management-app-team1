import { Router } from '@angular/router';
import { ConfirmDialogComponent } from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CreateUpdateModalComponent } from '../../../shared/components/project-create-update-modal/create-update-modal.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ICreateEditModel,
  ConfirmDialogModel,
} from './../../../core/models/dialog.model';
import { switchMap, map } from 'rxjs';
import { IBoard } from './../../../core/models/data.model';
import { ProjectsDataService } from './../../../core/services/projects-data.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-preview',
  templateUrl: './project-preview.component.html',
  styleUrls: ['./project-preview.component.scss'],
})
export class ProjectPreviewComponent {
  @Input() public project!: IBoard;

  constructor(
    private projectsService: ProjectsDataService,
    private projectModal: MatDialog,
    private router: Router
  ) {}

  deleteProject(projectId: string) {
    const dialogData = new ConfirmDialogModel(
      'Project-modal-delete-title',
      'Project-modal-delete-message',
      'Delete'
    );

    const dialogRef = this.projectModal.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.projectsService
          .deleteProject(projectId)
          .pipe(
            switchMap(() =>
              this.projectsService.getProjects().pipe(map((value) => value))
            )
          )
          .subscribe();
      }
    });
  }

  updateProject(projectId: string) {
    const dialogData: ICreateEditModel = {
      title: 'Project-modal-edit-title',
      titleLabel: 'Project-modal-title',
      descriptionLabel: 'Project-modal-description',
      commandName: 'Project-modal-edit',
      titleField: this.project.title,
      descriptionField: this.project.description,
      showDescription: true
    };

    const dialogRef = this.projectModal.open(
      CreateUpdateModalComponent,
      {
        maxWidth: '600px',
        data: dialogData,
      }
    );

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.projectsService
          .updateProject(
            projectId,
            dialogResult[0],
            dialogResult[1],
            dialogResult[2],
            dialogResult[3]
          )
          .pipe(
            switchMap(() =>
              this.projectsService.getProjects().pipe(map((value) => value))
            )
          )
          .subscribe();
      }
    });
  }

  openBoard() {
    this.router.navigate(['board', this.project._id]);
  }
}
