import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[trClickOutside]',
})
export class ClickOutsideDirective {
  private el = inject(ElementRef);

  trClickOutside = output<void>();

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = this.el.nativeElement.contains(target);

    if (!clickedInside) {
      this.trClickOutside.emit();
    }
  }
}
