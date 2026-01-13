import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'validationMessages',
  pure: false,
})
export class ValidationMessagesPipe implements PipeTransform {
  transform(control: AbstractControl | null): string {
    if (!control || (!control.touched && !control.dirty)) return '\u00A0';
    if (control.errors?.['required']?.message) return control.errors['required'].message;
    if (control.errors?.['forbiddenPattern']?.message) return control.errors['forbiddenPattern'].message;

    return '';
  }
}
