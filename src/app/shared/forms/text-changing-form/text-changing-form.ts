import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Btn } from '@shared/btn/btn';
import { TextInput } from '@shared/inputs/text-input/text-input';
import { Loader } from '@shared/loader/loader';
import { ValidationMessagesPipe } from '@shared/pipes/validation-messages-pipe';
import { BoardStore } from '@stores/board-store';

@Component({
  selector: 'tr-text-changing-form',
  imports: [ReactiveFormsModule, Btn, TextInput, ValidationMessagesPipe, Loader],
  templateUrl: './text-changing-form.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextChangingForm {
  private fb = inject(FormBuilder);
  store = inject(BoardStore);

  currentText = input<string>('');
  updatedText = output<string>();

  @ViewChild('inputRef') inputRef!: TextInput;

  private lastSaveSource: 'enter' | 'blur' | null = null;
  isEditing = signal<boolean>(false);
  readonly isDisabled = computed(() => this.store.isBoardUpdating());

  readonly form = this.fb.group({
    inputText: ['', [Validators.required, Validators.pattern(/^(?!.*[эЭёЁ])[a-zA-Zа-яА-ЯїЇіІєЄґҐ0-9 .\-_]+$/)]],
  });

  constructor() {
    effect(() => {
      if (this.isEditing()) {
        setTimeout(() => {
          this.inputRef?.focus();
        });
      }
    });
  }

  get textControl() {
    return this.form.controls['inputText'] as FormControl;
  }

  enableEdit = (): void => {
    this.isEditing.set(true);
    this.form.patchValue({ inputText: this.currentText() });
  };

  saveEdit(source: 'enter' | 'blur') {
    if (!this.isEditing() || this.form.invalid) {
      return;
    }
    if (source === 'blur' && this.lastSaveSource === 'enter') {
      return;
    }
    const inputText = this.textControl.value.trim();

    if (inputText && inputText !== this.currentText()) {
      this.updatedText.emit(inputText);
    }
    this.isEditing.set(false);
    this.lastSaveSource = source;

    queueMicrotask(() => (this.lastSaveSource = null));
  }
}
