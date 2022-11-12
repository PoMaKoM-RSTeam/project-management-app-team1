import { DatabaseService } from './database.service';
import { IBoard, IError } from './../models/data.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjectsDataService {
  public projects: BehaviorSubject<IBoard[]> = new BehaviorSubject<IBoard[]>(
    []
  );

  constructor(private database: DatabaseService) {}

  getProjectField(): Observable<IBoard[]> {
    return this.projects.asObservable();
  }

  public createProject(
    projectTitle: string,
    projectDescription: string
  ): Observable<IBoard> {
    return this.database.createBoard(projectTitle, projectDescription).pipe(
      map((result) => {
        return result as IBoard;
      })
    );
  }

  public getProjects(): Observable<IBoard[]> {
    return this.database.getBoards().pipe(
      map((result) => {
        if (result) {
          const boards: IBoard[] = result as IBoard[];
          this.projects.next(boards);
        }
        return result as IBoard[];
      })
    );
  }

  public deleteProject(projectId: string): Observable<IError | null> {
    return this.database.deleteBoard(projectId).pipe(
      map((result) => {
        if (result === null) {
          this.database.getBoards().pipe(
            map((project) => {
              if (project) {
                const boards: IBoard[] = project as IBoard[];
                this.projects.next(boards);
              }
              return project as IBoard[];
            })
          );
        }
        return result;
      })
    );
  }

  public updateProject(
    projectId: string,
    title: string,
    description: string,
    owner: string,
    users: string[]
  ): Observable<IBoard> {
    return this.database
      .updateBoard(projectId, { title, description, owner, users })
      .pipe(
        map((result) => {
          return result as IBoard;
        })
      );
  }
}
