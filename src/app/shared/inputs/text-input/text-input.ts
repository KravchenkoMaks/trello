import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TInputRole } from '@models/types/t-input-role';

const noop = () => {
  // no-op
};

@Component({
  selector: 'tr-text-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-input.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInput),
      multi: true,
    },
  ],
})
export class TextInput implements ControlValueAccessor {
  private el = inject(ElementRef);
  blurEvent = output<void>();

  control = input<FormControl>();
  label = input<string>('');
  role = input<TInputRole>();
  placeholder = input<string>('');
  type = input<'text' | 'email' | 'password'>('text');

  value = '';
  disabled = false;
  touched = false;

  private onChange: (value: string) => void = noop;
  private onTouched: () => void = () => noop;

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleBlur(): void {
    this.markAsTouched();
    this.blurEvent.emit();
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  focus(): void {
    const inputEl = this.el.nativeElement.querySelector('input');
    inputEl?.focus();
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
  }

  baseClasses = 'text-stone-500 rounded-sm px-2 py-1 placeholder-stone-500 focus:outline-none';

  private readonly inputClassMap: Record<TInputRole, string> = {
    createBoard: 'bg-zinc-900 ',
    changeTitle: 'bg-zinc-800 ',
  };

  getInputClasses(): string {
    const role = this.role();

    const inputClasses = role ? this.inputClassMap[role] : '';

    let validationClasses = '';

    if (role === 'createBoard' && this.control()) {
      const ctrl = this.control();

      if (ctrl?.invalid) {
        console.log(3333);
        validationClasses = 'ring-1 ring-red-500 focus:ring-red-500';
      } else if (ctrl?.valid) {
        console.log(4444);
        validationClasses = 'ring-1 ring-blue-600  focus:ring-blue-600';
      }
    }

    return `${this.baseClasses} ${inputClasses} ${validationClasses}`.trim();
  }
}
