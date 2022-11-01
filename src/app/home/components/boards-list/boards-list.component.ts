import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsListComponent {}
