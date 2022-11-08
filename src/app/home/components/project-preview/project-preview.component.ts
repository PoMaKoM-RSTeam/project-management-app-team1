import { Router } from '@angular/router';
import { ConfirmDialogComponent } from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProjectCreateUpdateModalComponent } from './../../../shared/components/project-create-update-modal/project-create-update-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ICreateEditProject, ConfirmDialogModel } from './../../../core/models/dialog.model';
import { switchMap, map } from 'rxjs';
import { IBoard } from './../../../core/models/data.model';
import { ProjectsDataService } from './../../../core/services/projects-data.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-preview',
  templateUrl: './project-preview.component.html',
  styleUrls: ['./project-preview.component.scss']
})
export class ProjectPreviewComponent {

  @Input() public project!: IBoard;

  constructor(private projectsService: ProjectsDataService,  private projectModal: MatDialog, private router: Router,) { }
    
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
        this.projectsService.deleteProject(projectId).pipe(
          switchMap(()=>this.projectsService.getProjects().pipe(map((value)=>value)))
        ).subscribe();
      }
    });
  }

  updateProject(projectId: string) {
    const dialogData: ICreateEditProject = {
      title:'Project-modal-edit-title',
      projectTitleLabel:'Project-modal-title',
      projectDescriptionLabel:'Project-modal-description',
      commandName:'Project-modal-edit',
      projectTitle: this.project.title,
      projectDescription: this.project.description,
    };

    const dialogRef = this.projectModal.open(ProjectCreateUpdateModalComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.projectsService.updateProject(projectId, dialogResult[0], dialogResult[1]).pipe(
          switchMap(()=>this.projectsService.getProjects().pipe(map((value)=>value)))
        ).subscribe();
      }
    });
  }

  openBoard() {
    this.router.navigate(['board', this.project.id]);
  }
}
