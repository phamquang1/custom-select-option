import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appScrollTracker]',
})
export class ScrollTrackerDirective {
  @Output() scrolledToBottom = new EventEmitter<boolean>();

  constructor(private el: ElementRef) {}

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    console.log(target);
    const atBottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;

    if (atBottom) {
      this.scrolledToBottom.emit(true);
    }
  }
}
