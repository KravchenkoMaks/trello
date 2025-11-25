import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';
import { IBoard } from '../../interfaces/i-board';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'tr-board-header',
  imports: [ReactiveFormsModule],
  templateUrl: './board-header.html',
  styleUrl: './board-header.css',
})
export class BoardHeader {
  @Input() board = signal<IBoard | undefined>(undefined);
  @Input() form!: FormGroup;

  @Output() titleUpdated = new EventEmitter<string>();

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  isEditing = signal(false);

  enableEdit() {
    this.isEditing.set(true);
    const title = this.board()?.title?.trim() ?? '';
    this.form.patchValue({ title });
    setTimeout(() => this.inputRef?.nativeElement.focus());
  }

  saveEdit() {
    if (this.form.invalid) return;

    const newTitle = this.form.value.title.trim();
    this.titleUpdated.emit(newTitle);
    this.isEditing.set(false);
  }
}
