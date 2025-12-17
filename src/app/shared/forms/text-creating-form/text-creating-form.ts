import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { TextInput } from '@shared/inputs/text-input/text-input';
import { Btn } from '@shared/btn/btn';

@Component({
  selector: 'tr-text-creating-form',
  imports: [ReactiveFormsModule, CommonModule, TextInput, Btn],
  templateUrl: './text-creating-form.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTitleForm {
  label = input<string>('');
  placeholder = input<string>('');
  newTitle = output<string>();

  private fb = new FormBuilder();

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_]+$/)]],
  });

  get titleControl() {
    return this.form.controls['title'] as FormControl;
  }

  onSubmit = (): void => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const title = this.form.controls['title'].value?.trim();
    if (!title) {
      return;
    }
    this.newTitle.emit(title);
  };
}
