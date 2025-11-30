import { Component, ElementRef, ViewChild, effect, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IBoard } from '../../../interfaces/i-board';

@Component({
  selector: 'tr-board-header-form',
  imports: [ReactiveFormsModule],
  templateUrl: './board-header-form.html',
  styles: ``,
})
export class BoardHeaderForm {
  board = input<IBoard | undefined>(undefined);
  form = input.required<FormGroup>();
  titleUpdated = output<string>();

  isEditing = signal(false);

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  constructor() {
    effect(() => {
      if (this.isEditing()) {
        queueMicrotask(() => this.inputRef?.nativeElement.focus());
      }
    });
  }

  enableEdit() {
    this.isEditing.set(true);
    const title = this.board()?.title?.trim() ?? '';
    this.form().patchValue({ title });
  }

  saveEdit() {
    const form = this.form();
    if (form.invalid) return;

    const newTitle = form.value.title.trim();
    this.titleUpdated.emit(newTitle);
    this.isEditing.set(false);
  }
}
