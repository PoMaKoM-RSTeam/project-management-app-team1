import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreateEditProject } from '../../../core/models/dialog.model';

@Component({
  selector: 'app-project-create-update-modal',
  templateUrl: './project-create-update-modal.component.html',
  styleUrls: ['./project-create-update-modal.component.scss']
})
export class ProjectCreateUpdateModalComponent {

  title: string;

  projectTitleLabel!: string;

  projectTitle: string = '';

  projectDescriptionLabel: string;

  projectDescription: string = '';
  
  commandName: string;

  constructor(
    public dialogRef: MatDialogRef<ProjectCreateUpdateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dialog: ICreateEditProject
  ) {
    this.title = dialog.title;
    this.projectTitleLabel = dialog.projectTitleLabel;
    this.projectDescriptionLabel = dialog.projectDescriptionLabel;
    this.commandName = dialog.commandName;
  }

  onCommand(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
