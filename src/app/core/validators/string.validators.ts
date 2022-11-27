import { AbstractControl, ValidatorFn } from '@angular/forms';

export class StringValidators {
  static lowerAndUpperCase(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value == '') return null;

      let re = new RegExp('(?=.*[A-Z])(?=.*[a-z]).{1,}$');

      if (re.test(control.value)) {
        return null;
      } else {
        return { lowerAndUpperCase: true };
      }
    };
  }

  static lettersAndNumbers(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value == '') return null;

      let str = String(control.value).toLowerCase();
      let re = new RegExp('(?=.*[0-9])(?=.*[a-z]).{1,}$');

      if (re.test(str)) {
        return null;
      } else {
        return { lettersAndNumbers: true };
      }
    };
  }

  static leastOneSpecChar(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value == '') return null;

      let re = new RegExp('[^\\w\\s]+');

      if (re.test(control.value)) {
        return null;
      } else {
        return { leastOneSpecChar: true };
      }
    };
  }

  static onlyCharacter(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value == '') return null;

      let re = new RegExp('^[a-zA-Z ]*$');

      if (re.test(control.value)) {
        return null;
      } else {
        return { onlyChar: true };
      }
    };
  }
}
