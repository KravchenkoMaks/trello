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
  newTitle = output<string>();

  readonly formGroup = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_ \n]+$/)]],
  });

  titleCtrl = computed(() => this.formGroup.controls['title']);

  private lastSaveSource: 'enter' | 'blur' | null = null;

  onSubmit = (source: 'enter' | 'blur' = 'enter') => {
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

    this.newTitle.emit(title);
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
