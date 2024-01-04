import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OptionComponent } from './option/option.component';
import { SelectComponent } from './select.component';
import { ScrollTrackerDirective } from './scroll-tracker.directive';

@NgModule({
  declarations: [SelectComponent, OptionComponent, ScrollTrackerDirective],
  imports: [CommonModule, OverlayModule, ReactiveFormsModule],
  exports: [SelectComponent, OptionComponent],
})
export class SelectModule {}
