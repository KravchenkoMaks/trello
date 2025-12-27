import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { TBgColor } from '@types';
const noop = () => {
  // no-op
};

@Component({
  selector: 'tr-single-text-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './single-text-input.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleTextInput),
      multi: true,
    },
  ],
})
export class SingleTextInput implements ControlValueAccessor {
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  private injector = inject(Injector);

  blurEvent = output<void>();
  saved = output<string>();

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
    this.cdr.markForCheck();
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
    const inputEl = this.el.nativeElement.querySelector('input, textarea');
    inputEl?.focus();
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';

    const extraSpace = this.calculateExtraSpace(textarea);

    textarea.style.height = textarea.scrollHeight + extraSpace + 'px';

    this.value = textarea.value ?? '';
    this.onChange(this.value);
    this.cdr.markForCheck();
  }

  onEnter(event: KeyboardEvent): void {
    if (event.shiftKey) return;
    event.preventDefault();

    const textarea = event.target as HTMLTextAreaElement;
    const currentValue = textarea.value.trim();
    if (!currentValue) return;

    this.value = currentValue;
    this.onChange(this.value);
    this.saved.emit(currentValue);

    textarea.value = '';
    textarea.style.height = 'auto';
    this.value = '';
    this.onChange(this.value);
  }

  private calculateExtraSpace(textarea: HTMLTextAreaElement): number {
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight || '20');
    const value = textarea.value;

    if (value.includes('\n') || this.isFirstLineFull(textarea, value)) {
      return lineHeight;
    }
    return 0;
  }

  private isFirstLineFull(textarea: HTMLTextAreaElement, value: string): boolean {
    const style = getComputedStyle(textarea);
    const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    context.font = font;

    const textWidth = context.measureText(value).width;
    const containerWidth = textarea.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

    return textWidth > containerWidth;
  }

  baseClasses = 'text-t-16 text-dark-500  px-2  focus:outline-none';

  private readonly inputBgClassMap: Record<TBgColor, string> = {
    darkLight: 'bg-dark-700',
    darkMedium: 'bg-dark-800',
    dark: 'bg-dark-900',
  };

  get ngControl(): NgControl | null {
    return this.injector.get(NgControl, null, { optional: true });
  }

  getInputClasses(): string {
    const inputBg = this.bg();

    const bgColor = inputBg ? this.inputBgClassMap[inputBg] : '';

    const styles =
      this.type() === 'textarea'
        ? 'w-full overflow-hidden resize-none leading-relaxed text-dark-100 bg-dark-800 rounded-(--r8) outline-none '
        : 'rounded-(--r2)';

    let validationClasses = '';

    const ctrl = this.ngControl?.control;
    if (this.ring() === 'color' && ctrl) {
      if (ctrl.invalid) {
        validationClasses = 'ring-1 ring-red-500  focus:ring-red-500 focus-visible:ring-2';
      } else {
        validationClasses = 'ring-1 ring-blue-600  focus:ring-blue-600 focus-visible:ring-2';
      }
    }

    return `${this.baseClasses} ${styles} ${bgColor} ${validationClasses}`.trim();
  }
}
