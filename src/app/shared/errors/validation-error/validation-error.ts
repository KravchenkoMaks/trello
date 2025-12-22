import { Component, input, Signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidationMessagesPipe } from '@shared/pipes/validation-messages-pipe';

@Component({
  selector: 'tr-validation-error',
  imports: [ValidationMessagesPipe],
  templateUrl: './validation-error.html',
  styles: ``,
})
export class ValidationError {
  control = input.required<Signal<AbstractControl>>();
}
