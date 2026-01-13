import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenCharactersPattern(regex: RegExp, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || regex.test(control.value)) {
      return null;
    }

    return { forbiddenPattern: { message } } satisfies ValidationErrors;
  };
}
