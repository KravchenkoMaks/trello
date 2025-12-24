import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, inject, input, output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

const noop = () => {
  // no-op
};

@Component({
  selector: 'tr-dynamic-text-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-text-input.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicTextInput),
      multi: true,
    },
  ],
})
export class DynamicTextInput implements ControlValueAccessor {
  private el = inject(ElementRef);
  blurEvent = output<void>();

  control = input<FormControl>();

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

    inputElement.style.width = `calc(${Math.min(this.value.length + 3, 96)}ch + 2px)`;
  }

  baseClasses = 'bg-dark-900 text-t-18 text-light  rounded-(--r2) px-2 placeholder-dark-800 focus:outline-none';
}
