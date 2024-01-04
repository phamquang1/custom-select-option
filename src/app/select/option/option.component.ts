import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionComponent<T> {
  @Input()
  filter: boolean = false;

  @Input()
  value: T | null = null;

  @HostBinding('class.selected')
  protected isSelected = false;

  @Output()
  selected = new EventEmitter<OptionComponent<T>>();
  constructor(private cd: ChangeDetectorRef) {}

  @HostListener('click')
  protected select() {
    if (this.filter) {
      return;
    }
    this.highlightAsSelected();
    this.selected.emit(this);
  }
  highlightAsSelected() {
    this.isSelected = true;
    this.cd.markForCheck();
  }
  deselect() {
    this.isSelected = false;
    this.cd.markForCheck();
  }
}
