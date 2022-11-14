import { ITask, IError } from './../models/data.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { DatabaseService } from 'src/app/core/services/database.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TasksDataService {

  public tasks: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>(
    []
  );

  getTasksField(): Observable<ITask[]> {
    return this.tasks.asObservable();
  }

  constructor(private database: DatabaseService) { }

  public createTask(
    title: string,
    description: string,
    order: number,
    columnId: string,
    boardId: string,
    userId: string,
  ): Observable<ITask | IError | null> {
    return this.database.createTask(boardId, columnId, { title, description, order, userId, users: ['Pavel'] }).pipe(
      map((result) => {
        console.log(result);
        if (result === null) {
          this.database.getTasks(boardId, columnId).pipe(
            map((task) => {
              console.log(task);
              if (task) {
                const tasks: ITask[] = task as ITask[];
                this.tasks.next(tasks);
              }
              return task as ITask[];
            })
          );
        }
        return result;
      })
    );
  }

  public getTasks(boardId: string, columnId: string): Observable<ITask[]> {
    return this.database.getTasks(boardId, columnId).pipe(
      map((result) => {
        if (result) {
          const tasks: ITask[] = result as ITask[];
          this.tasks.next(tasks);
        }
        return result as ITask[];
      })
    );
  }

}
