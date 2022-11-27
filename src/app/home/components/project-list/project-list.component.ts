import { Observable, Subject, takeUntil } from 'rxjs';
import { IBoard } from './../../../core/models/data.model';
import { ProjectsDataService } from './../../../core/services/projects-data.service';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnInit, OnDestroy {

  public projects$!: Observable<IBoard[]>;

  private destroy$: Subject<boolean> = new Subject();

  constructor(private projectsService: ProjectsDataService) {
    
  } 

  ngOnInit(): void {
    this.projectsService.getProjects().pipe(takeUntil(this.destroy$)).subscribe();
    this.projects$ = this.projectsService.getProjectField().pipe(value => value);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
