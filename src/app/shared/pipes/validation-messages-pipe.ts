import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'validationMessages',
  pure: false,
})
export class ValidationMessagesPipe implements PipeTransform {
  transform(control: AbstractControl | null): string {
    if (!control || (!control.touched && !control.dirty)) {
      console.log(111);
      return '\u00A0';
    }
    if (control.hasError('required')) {
      console.log(222);
      return 'Обов’язкове поле';
    }
    if (control.hasError('pattern')) {
      console.log(333);
      return 'Присутні невалідні символи';
    }
    return '';
  }
}
