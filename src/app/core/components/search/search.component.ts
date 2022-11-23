import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  combineLatestWith,
  debounceTime,
  fromEvent,
  map,
  Observable,
  switchMap,
  take,
} from 'rxjs';
import { ISearchResults, ITask } from '../../models/data.model';
import { SearchService } from '../../services/search.service';
import { UserStatusService } from '../../services/user-status.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  isFocused: boolean = false;

  isHovered: boolean = false;

  private readonly defaultValue: ISearchResults;

  results: ISearchResults[];

  constructor(
    private search: SearchService,
    private cdr: ChangeDetectorRef,
    private userStatusService: UserStatusService
  ) {
    this.defaultValue = {
      boardId: '',
      taskTitle: '',
      message: 'Search by tasks and users',
    };
    this.results = [this.defaultValue];
    this.userStatusService.getAllUsers().pipe(take(1)).subscribe();
  }

  ngAfterViewInit(): void {
    const data$ = fromEvent(this.searchInput.nativeElement, 'beforeinput').pipe(
      debounceTime(1000),
      switchMap(() => {
        return this.search.getCompleteBoardsData();
      })
    );
    fromEvent<KeyboardEvent>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(1500),
        map<KeyboardEvent, string>(() => this.searchInput.nativeElement.value),
        map<string, string>((searchValue: string) =>
          searchValue.length >= 3 ? searchValue : ''
        ),
        combineLatestWith<string, [ITask[]]>(data$),
        switchMap<[string, ITask[]], Observable<ISearchResults[]>>(
          ([searchValue, data]) =>
            this.search
              .getSearchInTasks(searchValue, data)
              .pipe((value) => value)
        )
      )
      .subscribe((results) => {
        this.results = results;
        if (results.length === 0)
          this.results = [
            {
              boardId: '',
              taskTitle: '',
              message: 'No Data Found',
            },
          ];
        this.cdr.detectChanges();
      });
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }

  onHover() {
    this.isHovered = true;
  }

  onLeave() {
    this.isHovered = false;
  }

  onSearch() {
    if (this.searchInput.nativeElement.value.length === 0) {
      this.results = [this.defaultValue];
    }
  }
}
