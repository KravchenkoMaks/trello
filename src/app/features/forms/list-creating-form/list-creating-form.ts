import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Btn } from '@buttons';
import { ValidationError } from '@errors';
import { TextInput } from '@inputs';

@Component({
  selector: 'tr-list-creating-form',
  imports: [ReactiveFormsModule, CommonModule, TextInput, Btn, ValidationError],
  templateUrl: './list-creating-form.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCreatingForm {
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
