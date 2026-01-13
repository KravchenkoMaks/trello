import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Btn } from '@buttons';
import { TITLE_PATTERN, TITLE_PATTERN_MESSAGE, TITLE_REQUIRED_MESSAGE } from '@constants';
import { ClickOutsideDirective } from '@directives';
import { ValidationError } from '@errors';
import { SingleTextInput } from '@inputs';
import { BoardStore } from '@stores';
import { forbiddenCharactersPattern, requiredWithMessage } from '@validators';

@Component({
  selector: 'tr-list-creating-form',
  imports: [ReactiveFormsModule, CommonModule, SingleTextInput, Btn, ValidationError, ClickOutsideDirective],
  templateUrl: './list-creating-form.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCreatingForm {
  private fb = inject(FormBuilder);
  store = inject(BoardStore);

  onClose = input<() => void>();
  newTitle = output<string>();

  readonly formGroup = this.fb.group({
    title: [
      '',
      [requiredWithMessage(TITLE_REQUIRED_MESSAGE), forbiddenCharactersPattern(TITLE_PATTERN, TITLE_PATTERN_MESSAGE)],
    ],
  });

  titleCtrl = computed(() => this.formGroup.controls['title']);

  private isClickOutside = false;

  onSubmit = (): void => {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const titleControl = this.formGroup.get('title');
    const title = titleControl?.value?.trim();

    if (!title) {
      return;
    }

    this.newTitle.emit(title);

    this.formGroup.reset();
  };

  close = (): void => {
    this.onClose()?.();
  };
}
