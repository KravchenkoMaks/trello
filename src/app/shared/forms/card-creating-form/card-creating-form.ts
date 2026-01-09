import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Btn } from '@buttons';
import { ClickOutsideDirective } from '@directives';
import { ValidationError } from '@errors';
import { SingleTextInput } from '@inputs';
import { BoardStore } from '@stores';

@Component({
  selector: 'tr-card-creating-form',
  imports: [ReactiveFormsModule, CommonModule, Btn, ValidationError, SingleTextInput, ClickOutsideDirective],
  templateUrl: './card-creating-form.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCreatingForm {
  fb = inject(FormBuilder);
  store = inject(BoardStore);
  el = inject(ElementRef);

  @ViewChild(SingleTextInput) inputRef!: SingleTextInput;

  onClose = input<() => void>();
  onSubmitProp = input<(title: string) => Promise<unknown>>();

  newTitle = output<string>();

  // Could we provide the error message here. I believe there is a way of providing a message for each validation rule. Something like:
  /*
    import { AbstractControl, ValidatorFn } from '@angular/forms';

    export function forbiddenCharactersPattern(message: string): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
        const regex = /^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_ \n]+$/;
        if (!control.value || regex.test(control.value)) {
          return null;
        }
        return { forbiddenPattern: { message } };
      };
    }
  */

  /*
  // In component:
  readonly formGroup = this.fb.group({
    title: ['', [Validators.required, forbiddenCharactersPattern('The card title should only include letters and numbers')]],
  });
   */

  /*
  // Then in template:
  <div *ngIf="titleControl?.hasError('forbiddenPattern')">
    {{ titleControl?.errors?.['forbiddenPattern'].message }}
  </div>

  // Or you could update the `tr-validation-error` to catch the actual error there (as you want to have reusable error message rendering)
  <tr-validation-error [control]="titleCtrl" [error]="'forbiddenPattern'"></tr-validation-error>
   */
  readonly formGroup = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_ \n]+$/)]],
  });

  titleCtrl = computed(() => this.formGroup.controls['title']);

  private lastSaveSource: 'enter' | 'blur' | null = null;

  async onSubmit(source: 'enter' | 'blur' = 'enter'): Promise<void> {
    const title = this.formGroup.controls['title'].value?.trim();
    if (!title) {
      this.close();
      return;
    }
    if (source === 'blur' && this.lastSaveSource === 'enter') {
      return;
    }

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    await this.onSubmitProp()?.(title);
    this.formGroup.reset();

    setTimeout(() => {
      this.inputRef?.resetAndFocus();
    });

    this.lastSaveSource = source;
    queueMicrotask(() => (this.lastSaveSource = null));
  };

  close = (): void => {
    this.onClose()?.();
  };
}
