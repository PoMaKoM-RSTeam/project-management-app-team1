import { Observable } from 'rxjs';
import { IBoard } from './../../../core/models/data.model';
import { ProjectsDataService } from './../../../core/services/projects-data.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnInit {

  public projects$!: Observable<IBoard[]>;

  constructor(private projectsService: ProjectsDataService) {
    
  } 

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe();
    this.projects$ = this.projectsService.getProjectField().pipe(value => value);
  }
}
