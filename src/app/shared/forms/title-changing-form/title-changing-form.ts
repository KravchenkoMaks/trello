import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Btn } from '@buttons';
import { ValidationError } from '@errors';
import { DynamicTextInput } from '@inputs';
import { forbiddenCharactersPattern, requiredWithMessage } from '@validators';
import { TITLE_PATTERN, TITLE_PATTERN_MESSAGE, TITLE_REQUIRED_MESSAGE } from '@constants';

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
    title: [
      '',
      [requiredWithMessage(TITLE_REQUIRED_MESSAGE), forbiddenCharactersPattern(TITLE_PATTERN, TITLE_PATTERN_MESSAGE)],
    ],
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
