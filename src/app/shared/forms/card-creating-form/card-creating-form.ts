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
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Btn } from '@buttons';
import { TITLE_PATTERN, TITLE_PATTERN_MESSAGE, TITLE_REQUIRED_MESSAGE } from '@constants';
import { ClickOutsideDirective } from '@directives';
import { ValidationError } from '@errors';
import { SingleTextInput } from '@inputs';
import { BoardStore } from '@stores';
import { forbiddenCharactersPattern, requiredWithMessage } from '@validators';

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

  readonly formGroup = this.fb.group({
    title: [
      '',
      [requiredWithMessage(TITLE_REQUIRED_MESSAGE), forbiddenCharactersPattern(TITLE_PATTERN, TITLE_PATTERN_MESSAGE)],
    ],
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
  }

  close = (): void => {
    this.onClose()?.();
  };
}
