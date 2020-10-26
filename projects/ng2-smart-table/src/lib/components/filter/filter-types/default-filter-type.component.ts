import { Input, Output, EventEmitter, OnDestroy, Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { Column } from '../../../lib/data-set/column';

@Component({
  template: '',
})
export class DefaultFilterTypeComponent implements Filter, OnDestroy {

  delay = 600;
  changesSubscription: Subscription;
  changesSubscription2: Subscription;
  @Input() query: string;
  @Input() inputClass: string;
  @Input() column: Column;
  @Input() language = 'en';
  @Output() filter = new EventEmitter<string>();

  ngOnDestroy() {
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
    if (this.changesSubscription2) {
      this.changesSubscription2.unsubscribe();
    }
  }

  setFilter() {
    this.filter.emit(this.query);
  }
}

export interface Filter {

  delay?: number;
  changesSubscription?: Subscription;
  changesSubscription2?: Subscription;
  query: string;
  inputClass: string;
  column: Column;
  language: string;
  filter: EventEmitter<string>;
}
