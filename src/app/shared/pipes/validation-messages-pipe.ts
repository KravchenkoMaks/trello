import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'validationMessages',
  pure: false,
})
export class ValidationMessagesPipe implements PipeTransform {
  transform(control: AbstractControl | null): string {
    if (!control || (!control.touched && !control.dirty)) return '\u00A0';
    if (control.errors?.['required']) return 'Поле обовʼязкове';
    if (control.errors?.['pattern']) return 'Присутні невалідні символи';
    if (control.errors?.['maxlength']) return 'Занадто довгий текст';
    return '';
  }
}
