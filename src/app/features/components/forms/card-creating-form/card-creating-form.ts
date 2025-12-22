import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Btn } from '@shared/btn/btn';
import { TextInput } from '@shared/inputs/text-input/text-input';
import { ValidationError } from '@shared/errors/validation-error/validation-error';

@Component({
  selector: 'tr-card-creating-form',
  imports: [ReactiveFormsModule, CommonModule, Btn, TextInput, ValidationError],
  templateUrl: './card-creating-form.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCreatingForm {
  fb = inject(FormBuilder);
  newTitle = output<string>();

  readonly formGroup = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_]+$/)]],
    description: ['', Validators.maxLength(4)],
    custom: this.fb.array([]),
  });

  titleCtrl = computed(() => this.formGroup.controls['title']);
  descriptionCtrl = computed(() => this.formGroup.controls['description']);

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
