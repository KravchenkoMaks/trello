import { ValidatorFn, AbstractControl, Validators } from '@angular/forms';

export function requiredWithMessage(message: string): ValidatorFn {
  const validator = Validators.required;
  return (control: AbstractControl) => {
    const result = validator(control);
    return result ? { required: { message } } : null;
  };
}
