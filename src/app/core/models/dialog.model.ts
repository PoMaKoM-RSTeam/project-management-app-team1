export class ConfirmDialogModel {
  constructor(
    public title: string,
    public message: string,
    public commandName: string
  ) {}
}
export interface ICreateEditProject {
  title: string;
  projectTitleLabel: string;
  projectDescriptionLabel: string;
  commandName: string;
}

