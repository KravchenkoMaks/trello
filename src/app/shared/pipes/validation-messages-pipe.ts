import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'validationMessages',
  pure: false,
})
export class ValidationMessagesPipe implements PipeTransform {
  transform(control: AbstractControl | null): string {
    if (!control || (!control.touched && !control.dirty)) {
      return '\u00A0';
    }
    if (control.hasError('required')) {
      return 'Обов’язкове поле';
    }
    if (control.hasError('pattern')) {
      return 'Присутні невалідні символи';
    }
    return '';
  }
}
