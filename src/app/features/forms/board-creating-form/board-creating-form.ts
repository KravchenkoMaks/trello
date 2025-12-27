import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, computed, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Btn } from '@buttons';
import { ValidationError } from '@errors';
import { SingleTextInput } from '@inputs';

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
    title: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_]+$/)]],
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
