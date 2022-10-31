import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line import/named
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'localizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {
  
  constructor(private translateService: TranslateService) {
  }

  transform(value: any, pattern: string = 'longDate'): any {
    const datePipe: DatePipe = new DatePipe(this.translateService.currentLang);
    console.log(datePipe.transform(value, pattern));
    return datePipe.transform(value, pattern);
  }

}
