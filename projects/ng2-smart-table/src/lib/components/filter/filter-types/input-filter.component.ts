import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';

import { DefaultFilterTypeComponent } from './default-filter-type.component';
import {Observable, Subscription} from "rxjs";
import {SessionStorageService} from "ngx-webstorage";

@Component({
  selector: 'lib-input-filter',
  template: `
    <input
      [ngClass]="inputClass"
      [formControl]="inputControl"
      class="form-control"
      type="text"
      placeholder="{{ column.title }}"/>
  `,
})
export class InputFilterComponent extends DefaultFilterTypeComponent implements OnInit, OnChanges, OnDestroy{
  @Input() events: Observable<void>;
  @Input() tableID: string;
  eventsSubscription: Subscription;
  inputControl = new FormControl();

  constructor(private sessionStorage: SessionStorageService) {
    super();
  }

  ngOnInit() {
    if (this.query) {
      this.inputControl.setValue(this.query);
    }
    this.inputControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.delay),
      )
      .subscribe((value: string) => {
        this.query = this.inputControl.value;
        this.setFilter();
      });
    // WAITING FOR INIT FILTER/SORT EVENT
    this.eventsSubscription = this.events.subscribe(() => {
      this.inputControl.setValue(null);
      this.sessionStorage.clear(this.tableID + '_' + this.column.id);
      this.sessionStorage.clear(this.tableID + '_sorting_' + this.column.id);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.inputControl.setValue(this.query);
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.eventsSubscription.unsubscribe();
  }
}
