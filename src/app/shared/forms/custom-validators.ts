import {AbstractControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import * as moment from 'moment';

import * as validator from 'validator';

export class CustomValidators extends Validators {
  static isRaw(method: string, options?: any) {
    return <ValidatorFn>function isMethod(control: AbstractControl) {
      let {value} = control;
      value       = (value !== undefined || value !== null) ? String(value) : '';
      return (!validator[method](value, options)) ? {[method]: `${method} is in an invalid state`} :
                                                    null;
    };
  };

  static fieldsMatch(field1: string, field2: string) {
    return <ValidatorFn>function isMethod(form: FormGroup) {
      return (form.controls[field1].value !== form.controls[field2].value) ?
          {fieldsMatch: `${field1} doesn't === ${field2}`} :
          null;
    };
  };
}
