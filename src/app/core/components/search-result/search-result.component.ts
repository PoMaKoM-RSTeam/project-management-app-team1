import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ISearchResults } from '../../models/data.model';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultComponent {
  @Input() result!: ISearchResults;

  constructor(private router: Router) {}

  goTo() {
    this.router.navigate(['/board']).then(() => {
      this.router.navigate([`/board/${this.result.boardId}`]).then();
    });
  }
}
