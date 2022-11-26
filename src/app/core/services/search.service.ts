import { Injectable } from '@angular/core';

import { map, mergeMap, reduce, switchMap } from 'rxjs/operators';

import { from, Observable, of } from 'rxjs';
import { IBoard, IError, ISearchResults, ITask } from '../models/data.model';

import { IUser } from '../models/user.model';
import { BoardApi } from './api/board.api';
import { TaskApi } from './api/task.api';
import { AppStatusService } from './app-status.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(
    private boardApi: BoardApi,
    private taskApi: TaskApi,
    private appStatusService: AppStatusService
  ) {}

  public getSearchInTasks(
    search: string,
    tasks: ITask[]
  ): Observable<ISearchResults[]> {
    const results = this.searchInBoards(search, tasks);

    const users = this.searchInUsers(search);

    if (users && users.length > 0) {
      return this.getUsersData(users).pipe(
        map((userTasks: ITask[]) => {
          if (userTasks && userTasks.length > 0) {
            const userTasksResults = this.getUsersTasks(users, userTasks);
            return results.concat(userTasksResults);
          }
          return results;
        })
      );
    }
    return of(results);
  }

  public getCompleteBoardsData(): Observable<ITask[]> {
    return this.boardApi.getBoards().pipe(
      map<IError | IBoard[], string[]>((boardsArray: IError | IBoard[]) => {
        return Array.isArray(boardsArray)
          ? boardsArray.reduce(
              (acc: string[], board: IBoard) => acc.concat(board._id),
              []
            )
          : [];
      }),
      switchMap<string[], Observable<string>>((boardsIds: string[]) => {
        return from(boardsIds);
      }),
      mergeMap<string, Observable<ITask[]>>((id: string) => {
        return this.taskApi.getTasksByBoardId(id);
      }),
      reduce<ITask[], ITask[]>((acc: ITask[], tasks: ITask[]) => {
        return acc.concat(tasks);
      }, [])
    );
  }

  public getTasksByUsers(usersIds: IUser[]): Observable<IUser[]> {
    return of(usersIds);
  }

  public getUsersData(usersIds: IUser[]): Observable<ITask[]> {
    return this.getTasksByUsers(usersIds).pipe(
      map<IError | IUser[], string[]>((usersArray: IError | IUser[]) => {
        return Array.isArray(usersArray)
          ? usersArray.reduce(
              (acc: string[], user: IUser) => acc.concat(user._id),
              []
            )
          : [];
      }),
      switchMap<string[], Observable<string>>((uIds: string[]) => {
        return from(uIds);
      }),
      mergeMap<string, Observable<ITask[]>>((id: string) => {
        return this.taskApi.getTasksByUser(id);
      }),
      reduce<ITask[], ITask[]>((acc: ITask[], tasks: ITask[]) => {
        return acc.concat(tasks);
      }, [])
    );
  }

  searchInBoards(search: string, tasks: ITask[]): ISearchResults[] {
    const results: ISearchResults[] = [];
    if (search) {
      const foundTasks = tasks.filter(
        (task: ITask) =>
          task?.title?.includes(search) || task?.description?.includes(search)
      );
      foundTasks.forEach((task: ITask) => {
        const foundIn = task.title.includes(search)
          ? task.title
          : task.description;
        results.push({
          boardId: task.boardId,
          columnId: task.columnId,
          taskId: task._id,
          taskTitle: task.title,
          userName: '',
          message: foundIn,
        });
      });
    }
    return results;
  }

  public searchInUsers(search: string): IUser[] {
    return this.appStatusService.Users.value.filter((user: IUser) =>
      user?.name?.includes(search)
    );
  }

  public getUsersTasks(users: IUser[], tasks: ITask[]): ISearchResults[] {
    const results: ISearchResults[] = [];
    tasks.forEach((task: ITask) => {
      results.push({
        boardId: task.boardId,
        columnId: task.columnId,
        taskId: task._id,
        taskTitle: task.title,
        userName:
          users.filter((user: IUser) => user._id === task.userId)[0]?.name ??
          'assigned',
        message: 'userName',
      });
    });

    return results;
  }
}
