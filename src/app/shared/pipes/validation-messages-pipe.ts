import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'validationMessages',
  pure: false,
})
export class ValidationMessagesPipe implements PipeTransform {
  transform(control: AbstractControl | null): string {
    if (!control || (!control.touched && !control.dirty)) return '\u00A0';
    if (control.errors?.['required']) return 'required field';
    if (control.errors?.['pattern']) return 'invalid characters present';
    return '';
  }
  //  todo: create control errors pattern
  // transform(control: AbstractControl | null, errorName?: string): string {
  //   if (!control || (!control.touched && !control.dirty)) return '\u00A0';
  //   if (control.errors?.[errorName].message) return control.errors?.[errorName].message;
  //   return '';
  // }
}
