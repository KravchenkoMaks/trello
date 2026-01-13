import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, computed, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Btn } from '@buttons';
import { ValidationError } from '@errors';
import { SingleTextInput } from '@inputs';
import { forbiddenCharactersPattern, requiredWithMessage } from '@validators';
import { TITLE_PATTERN, TITLE_PATTERN_MESSAGE, TITLE_REQUIRED_MESSAGE } from '@constants';

@Component({
  selector: 'tr-board-creating-form',
  imports: [ReactiveFormsModule, CommonModule, Btn, ValidationError, SingleTextInput],
  templateUrl: './board-creating-form.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardCreatingForm {
  private fb = inject(FormBuilder);
  newTitle = output<string>();

  readonly formGroup = this.fb.group({
    title: [
      '',
      [requiredWithMessage(TITLE_REQUIRED_MESSAGE), forbiddenCharactersPattern(TITLE_PATTERN, TITLE_PATTERN_MESSAGE)],
    ],
  });

  titleCtrl = computed(() => this.formGroup.controls['title']);

  onSubmit = (): void => {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    const title = this.formGroup.controls['title'].value?.trim();
    if (!title) {
      return;
    }
    this.newTitle.emit(title);
  };
}
