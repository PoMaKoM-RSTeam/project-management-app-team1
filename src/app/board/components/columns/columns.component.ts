import { IColumn } from './../../../core/models/data.model';
import { switchMap, map, Observable } from 'rxjs';
import { ColumnsDataService } from './../../../core/services/columns-data.service';
import { MatDialog } from '@angular/material/dialog';
import { ICreateEditModel } from './../../../core/models/dialog.model';
import { CreateUpdateModalComponent } from '../../../shared/components/project-create-update-modal/create-update-modal.component';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss']
})
export class ColumnsComponent implements OnInit {
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
  ];

  public columns$!: Observable<IColumn[]>;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private projectModal: MatDialog, 
    private columnsService: ColumnsDataService,
  ) {}

  ngOnInit(): void {
    this.columnsService.getColumns(this.activatedRoute.snapshot.params['id']).subscribe();
    this.columns$ = this.columnsService.getColumnsField().pipe(value => value);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

  createColumn() {
    const dialogData: ICreateEditModel = {
      title: 'Columns-modal-add-title',
      titleLabel: 'Columns-modal-title',
      commandName: 'Columns-modal-add',
      showDescription: false
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
        this.columnsService
          .createColumn(
            dialogResult[0],
            this.columnsService.columns.value.length,
            this.activatedRoute.snapshot.params['id']
          )
          .pipe(
            switchMap(() =>
              this.columnsService.getColumns(this.activatedRoute.snapshot.params['id']).pipe(map((value) => value))
            )
          )
          .subscribe();
      }
    });
    console.log(this.activatedRoute.snapshot.params['id']);
  }
}
