import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Btn } from '@buttons';
import { ValidationError } from '@errors';
import { DynamicTextInput } from '@inputs';

import { BoardStore } from '@stores';
import { TBtnName } from '@types';

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
  btnName = input<TBtnName>('changeBoardTitle');
  length = input<'short' | 'long'>('long');
  updatedTitle = output<string>();

  @ViewChild('inputRef') inputRef!: DynamicTextInput;

  private lastSaveSource: 'enter' | 'blur' | null = null;
  isEditing = signal<boolean>(false);

  readonly formGroup = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_]+$/)]],
  });

  titleCtrl = computed(() => this.formGroup.controls['title']);

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
