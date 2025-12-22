import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, inject, input, output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TBgColor } from '@types';

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
  placeholder = input<string>('');
  bg = input<TBgColor>('dark');
  ring = input<'color' | 'mono' | 'none'>('color');
  type = input<'text' | 'email' | 'password' | 'textarea'>('text');

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

  private readonly inputBgClassMap: Record<TBgColor, string> = {
    darkLight: 'bg-dark-1',
    darkMedium: 'bg-dark-2 ',
    dark: 'bg-dark-3 ',
  };

  getInputClasses(): string {
    const inputBg = this.bg();

    const inputClasses = inputBg ? this.inputBgClassMap[inputBg] : '';

    let validationClasses = '';

    const ctrl = this.control();
    if (this.ring() === 'color' && ctrl) {
      if (ctrl.invalid) {
        validationClasses = 'ring-1 ring-red-500 focus:ring-red-500 focus-visible:ring-2  ';
      } else {
        validationClasses = 'ring-1 ring-blue-600  focus:ring-blue-600 focus-visible:ring-2';
      }
    }
    if (this.ring() === 'mono') {
      validationClasses = 'focus-visible:ring-1';
    }

    return `${this.baseClasses} ${inputClasses} ${validationClasses}`.trim();
  }
}
