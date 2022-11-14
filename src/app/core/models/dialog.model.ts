import { IUser } from './user.model';
export class ConfirmDialogModel {
  constructor(
    public title: string,
    public message: string,
    public commandName: string
  ) {}
}
export interface ICreateEditModel {
  title: string;
  titleLabel: string;
  descriptionLabel?: string;
  commandName: string;
  titleField?: string;
  descriptionField?: string;
  usersLabel?: string;
  users?: IUser[];
}

