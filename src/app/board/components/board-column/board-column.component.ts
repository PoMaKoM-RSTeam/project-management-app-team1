import { UserStatusService } from './../../../core/services/user-status.service';
import { IUser } from './../../../core/models/user.model';
import { switchMap, map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ColumnsDataService } from './../../../core/services/columns-data.service';
import { ConfirmDialogComponent } from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CreateUpdateModalComponent } from '../../../shared/components/project-create-update-modal/create-update-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, ICreateEditModel } from './../../../core/models/dialog.model';
import { IColumn } from './../../../core/models/data.model';
import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss']
})
export class BoardColumnComponent implements OnInit {
  @Input() public column!: IColumn;

  public users$!: Observable<IUser[]>;

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep', 'Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  constructor(
    private projectModal: MatDialog, 
    private columnsService: ColumnsDataService,
    private activatedRoute: ActivatedRoute,
    private userStatusService: UserStatusService
  ) { }

  ngOnInit(): void {
    this.userStatusService.getAllUsers().subscribe();
    this.users$ = this.userStatusService.getUsers().pipe(value => value);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  updateColumn() {

  }

  deleteColumn(columnId: string) {
    const dialogData = new ConfirmDialogModel(
      'Columns-modal-delete-title',
      'Columns-modal-delete-message',
      'Delete'
    );

    const dialogRef = this.projectModal.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.columnsService
          .deleteColumn(this.activatedRoute.snapshot.params['id'], columnId)
          .pipe(
            switchMap(() =>
              this.columnsService.getColumns(this.activatedRoute.snapshot.params['id']).pipe(map((value) => value))
            )
          )
          .subscribe();
      }
    });
  }

  addNewTask() {
    const dialogData: ICreateEditModel = {
      title: 'Task-modal-add-title',
      titleLabel: 'Task-modal-title',
      descriptionLabel: 'Task-modal-description',
      commandName: 'Task-modal-add',
      usersLabel: 'Task-modal-user-titel',
      users: this.userStatusService.users.value
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
        console.log(dialogResult);
      }
    });
  }
}
