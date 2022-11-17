export interface IBoard {
  _id: string;
  title: string;
  description: string;
  owner: string; // "userId of owner",
  users?: string[]; // [ "userId of invited user #1", "userId of invited user #2" ]
}

export type TBoardInfo = Omit<IBoard, '_id'>;

export interface IBoardComplete extends IBoard {
  columns: IColumnComplete[];
}

export interface IColumn {
  _id: string;
  title: string;
  order: number;
  boardId: string;
}

export type TColumnInfo = Omit<IColumn, '_id' | 'boardId'>;

export interface IColumnComplete extends IColumn {
  tasks: ITask[];
}

export interface ITask {
  _id: string;
  title: string;
  order: number;
  description: string;
  userId: string; // "userId of task owner"
  users: string[]; // [ "userId of responsible user #1", "userId of responsible user #2" ]
  boardId: string;
  columnId: string;
}

export type TTaskInfoExtended = Omit<ITask, '_id' | 'boardId'>;

export type TTaskInfo = Omit<TTaskInfoExtended, '_id' | 'boardId' | 'columnId'>;

export interface IError {
  statusCode: number;
  message: string;
}

export interface ITokenResponse {
  token: string;
}

export interface IPoint {
  _id: string;
  title: string;
  done: boolean;
  taskId: string;
  boardId: string;
}

export type IPointInfo = Omit<IColumn, '_id'>;
