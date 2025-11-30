import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'tr-title-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './title-form.html',
  styleUrl: './title-form.css',
})
export class TitleForm {
  modalTitle = input<string>('');
  label = input<string>('');
  placeholder = input<string>('');

  titleSubmitted = output<string>();

  private fb = new FormBuilder();

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_]+$/)]],
  });

  get titleControl(): FormControl {
    return this.form.controls.title;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const title = this.form.controls['title'].value?.trim();
    if (!title) return;

    this.titleSubmitted.emit(title);
  }
}
