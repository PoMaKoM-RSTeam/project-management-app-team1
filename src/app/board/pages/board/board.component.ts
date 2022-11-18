import { takeUntil, Subject } from 'rxjs';
import { ProjectsDataService } from './../../../core/services/projects-data.service';
import { ActivatedRoute } from '@angular/router';
import { IBoard } from './../../../core/models/data.model';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit, OnDestroy {
  board!: IBoard;

  private destroy$: Subject<boolean> = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    public projectsService: ProjectsDataService
  ) {}

  ngOnInit(): void {
    this.projectsService
      .getProject(this.activatedRoute.snapshot.params['id'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((board) => {
        this.board = board;
      });
    this.projectsService.project.pipe(takeUntil(this.destroy$)).subscribe((board) => {
      this.board = board;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
