import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Btn } from '@buttons';
import { ValidationError } from '@errors';
import { DynamicTextInput, TextInput } from '@inputs';

import { BoardStore } from '@stores';

@Component({
  selector: 'tr-title-changing-form',
  imports: [ReactiveFormsModule, Btn, ValidationError, DynamicTextInput],
  templateUrl: './title-changing-form.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleChangingForm {
  private fb = inject(FormBuilder);
  store = inject(BoardStore);

  currentTitle = input<string>('');
  updatedTitle = output<string>();

  @ViewChild('inputRef') inputRef!: TextInput;

  private lastSaveSource: 'enter' | 'blur' | null = null;
  isEditing = signal<boolean>(false);
  readonly isDisabled = computed(() => this.store.isBoardUpdating());

  readonly formGroup = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_]+$/)]],
  });

  titleCtrl = computed(() => this.formGroup.controls['title']);

  constructor() {
    effect(() => {
      if (this.isEditing()) {
        setTimeout(() => {
          this.inputRef?.focus();
        });
      }
    });
  }

  enableEdit = (): void => {
    this.isEditing.set(true);
    this.formGroup.patchValue({ title: this.currentTitle() });
  };

  saveEdit(source: 'enter' | 'blur') {
    if (!this.isEditing() || this.formGroup.invalid) {
      return;
    }
    if (source === 'blur' && this.lastSaveSource === 'enter') {
      return;
    }
    const inputText = this.formGroup.controls['title'].value?.trim();

    if (inputText && inputText !== this.currentTitle()) {
      this.updatedTitle.emit(inputText);
    }
    this.isEditing.set(false);
    this.lastSaveSource = source;

    queueMicrotask(() => (this.lastSaveSource = null));
  }
}
