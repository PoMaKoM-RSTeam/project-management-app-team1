import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetter'
})
export class FirstLetterPipe implements PipeTransform {

  transform( value: string ): string {
    let first = (value.substring(0, 1) === ' ') ? value.substring(1, 2).toUpperCase() : value.substring(0, 1).toUpperCase();

    return first;
  }

}
