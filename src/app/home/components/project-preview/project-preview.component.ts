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

  constructor(private projectsService: ProjectsDataService) {
  
  }
    
  deleteProject(projectId: string) {
    this.projectsService.deleteProject(projectId).pipe(
      switchMap(()=>this.projectsService.getProjects().pipe(map((value)=>value)))
    ).subscribe();
  }
}
