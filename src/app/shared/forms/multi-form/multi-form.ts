import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Btn } from '@shared/btn/btn';
import { TextInput } from '@shared/inputs/text-input/text-input';
import { ValidationMessagesPipe } from '@shared/pipes/validation-messages-pipe';

@Component({
  selector: 'tr-multi-form',
  imports: [ReactiveFormsModule, CommonModule, Btn, TextInput, ValidationMessagesPipe],
  templateUrl: './multi-form.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiForm {
  fb = inject(FormBuilder);

  labelT = 'Назва картки';
  placeholderT = 'Введіть назву картки';
  labelD = 'Опис';
  placeholderD = 'Додайте опис';

  readonly formGroup = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_]+$/)]],
    description: ['', Validators.maxLength(4)],
    custom: [],
  });

  titleControl = computed(() => this.formGroup.controls['title']);
  descriptionControl = computed(() => this.formGroup.controls['description']);

  onSubmit = (): void => {
    console.log('form');
  };
}
