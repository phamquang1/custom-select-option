import {
  AnimationEvent,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { Subject, merge, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { OptionComponent } from './option/option.component';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [
    trigger('dropDown', [
      state('void', style({ transform: 'scaleY(0)', opacity: 0 })),
      state('*', style({ transform: 'scaleY(1)', opacity: 1 })),
      transition(':enter', [animate('320ms cubic-bezier(0, 1, 0.45, 1.34)')]),
      transition(':leave', [
        animate('420ms cubic-bezier(0.88,-0.7, 0.86, 0.85)'),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T>
  implements OnInit, AfterContentInit, OnDestroy, OnChanges
{
  @Input()
  label = 'helo';

  @Input()
  displayWith: ((value: T) => string | number) | null = null;

  @Input()
  compareWith: (v1: T | null, v2: T | null) => boolean = (v1, v2) => v1 === v2;

  @Input()
  set value(value: T | null) {
    this.selectionModel.clear();
    if (value) {
      this.selectionModel.select(value);
    }
  }
  get value() {
    return this.selectionModel.selected[0] || null;
  }

  @Output()
  readonly opened = new EventEmitter<void>();

  @Output()
  readonly selectionChanged = new EventEmitter<T | null>();

  private selectionModel = new SelectionModel<T>();

  // @Output()
  // readonly selectionChanged = new EventEmitter<SelectValue<T>>();

  @Output()
  readonly closed = new EventEmitter<void>();

  @HostBinding('class.select-panel-open')
  isOpen = false;

  @HostListener('click')
  open() {
    this.isOpen = true;
  }

  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent<T>>;

  private optionMap = new Map<T | null, OptionComponent<T>>();

  private unsubscribe$ = new Subject<void>();

  constructor(private cd: ChangeDetectorRef, private hostEl: ElementRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compareWith']) {
      this.selectionModel.compareWith = changes['compareWith'].currentValue;
      this.highlightSelectedOptions();
    }
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  ngOnInit(): void {}
  ngAfterContentInit(): void {
    this.selectionModel.changed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((values) => {
        values.removed.forEach((rv) => this.optionMap.get(rv)?.deselect());
        values.added.forEach((rv) =>
          this.optionMap.get(rv)?.highlightAsSelected()
        );
      });
    this.options.changes
      .pipe(
        startWith<QueryList<OptionComponent<T>>>(this.options),
        tap(() => this.refreshOptionsMap()),
        tap(() => queueMicrotask(() => this.highlightSelectedOptions())),
        switchMap((options) => merge(...options.map((o) => o.selected)))
      )
      .subscribe((selectedOption) => this.handleSelection(selectedOption));
  }
  protected get displayValue() {
    if (this.displayWith && this.value) {
      if (Array.isArray(this.value)) {
        return this.value.map(this.displayWith);
      }
      return this.displayWith(this.value);
    }
    return this.value;
  }
  private refreshOptionsMap() {
    this.optionMap.clear();
    this.options.forEach((o) => this.optionMap.set(o.value, o));
  }
  private handleSelection(option: OptionComponent<T>) {
    if (option.value) {
      this.selectionModel.toggle(option.value);
      this.selectionChanged.emit(this.value);
    }
    this.close();
  }
  close() {
    this.isOpen = false;
  }

  protected onPanelAnimationDone({ fromState, toState }: AnimationEvent) {
    if (fromState === 'void' && toState === null && this.isOpen) {
      this.opened.emit();
    }
    if (fromState === null && toState === 'void' && !this.isOpen) {
      this.closed.emit();
    }
  }

  private highlightSelectedOptions() {
    const valuesWithUpdatedReferences = this.selectionModel.selected.map(
      (value) => {
        const correspondingOption = this.findOptionsByValue(value);
        return correspondingOption ? correspondingOption.value! : value;
      }
    );
    this.selectionModel.clear();
    this.selectionModel.select(...valuesWithUpdatedReferences);
  }

  private findOptionsByValue(value: T | null) {
    if (this.optionMap.has(value)) {
      return this.optionMap.get(value);
    }
    return (
      this.options && this.options.find((o) => this.compareWith(o.value, value))
    );
  }
}
