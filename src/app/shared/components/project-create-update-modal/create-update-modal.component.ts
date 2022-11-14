import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreateEditModel } from '../../../core/models/dialog.model';

@Component({
  selector: 'app-create-update-modal',
  templateUrl: './create-update-modal.component.html',
  styleUrls: ['./create-update-modal.component.scss']
})
export class CreateUpdateModalComponent {

  title: string;

  titleLabel!: string;

  titleField: string = '';

  descriptionLabel: string;

  descriptionField: string = '';
  
  commandName: string;

  showDescription: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<CreateUpdateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dialog: ICreateEditModel
  ) {
    this.title = dialog.title;
    this.titleLabel = dialog.titleLabel;
    this.descriptionLabel = dialog.descriptionLabel ?? '';
    this.commandName = dialog.commandName;
    this.titleField = dialog.titleField ?? '';
    this.descriptionField = dialog.descriptionField ?? '';
    this.showDescription = dialog.showDescription;
  }

  onCommand(): void {
    this.dialogRef.close([this.titleField, this.descriptionField]);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
