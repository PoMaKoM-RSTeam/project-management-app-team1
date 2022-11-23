import { Pipe, PipeTransform } from '@angular/core';
import { ISearchResults } from '../models/data.model';

@Pipe({
  name: 'sortSearchResults',
})
export class SortSearchResultsPipe implements PipeTransform {
  transform(results: ISearchResults[]): ISearchResults[] {
    return results.sort((a, b) => a.taskTitle.localeCompare(b.taskTitle));
  }
}
