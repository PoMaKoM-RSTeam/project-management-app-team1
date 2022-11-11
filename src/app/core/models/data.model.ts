export interface IBoard {
  _id: string;
  title: string;
  description: string;
}

export type TBoardTitle = Omit<IBoard, '_id'>;

export interface IBoardComplete extends IBoard {
  columns: IColumnComplete[];
}

export interface IColumn {
  _id: string;
  title: string;
  order: number;
}

export type TColumnInfo = Omit<IColumn, '_id'>;

export interface IColumnComplete extends IColumn {
  tasks: ITask[];
}

export interface ITask {
  _id: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  boardId: string;
  columnId: string;
}

export type TTaskInfoExtended = Omit<ITask, '_id'>;

export type TTaskInfo = Omit<TTaskInfoExtended, 'boardId' | 'columnId'>;

export interface IError {
  statusCode: number;
  message: string;
}

export interface ITokenResponse {
  token: string;
}
