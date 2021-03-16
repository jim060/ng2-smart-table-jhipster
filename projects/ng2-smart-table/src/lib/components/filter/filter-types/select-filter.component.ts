import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, NgControl} from '@angular/forms';
import { distinctUntilChanged, debounceTime, skip } from 'rxjs/operators';

import { DefaultFilterTypeComponent } from './default-filter-type.component';
import {SessionStorageService} from "ngx-webstorage";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'lib-select-filter',
  template: `
    <select [ngClass]="inputClass"
            class="form-control"
            #inputControl
            [(ngModel)]="query">

        <option value="">{{ column.getFilterConfig().selectText }}</option>
        <option *ngFor="let option of column.getFilterConfig().list" [value]="option.value">
          {{ option.title }}
        </option>
    </select>
  `,
})
export class SelectFilterComponent extends DefaultFilterTypeComponent implements OnInit, OnDestroy {
  @Input() events: Observable<void>;
  @Input() tableID: string;
  eventsSubscription: Subscription;
  @ViewChild('inputControl', { read: NgControl, static: true }) inputControl: NgControl;

  constructor(private sessionStorage: SessionStorageService) {
    super();
  }

  ngOnInit() {
    this.inputControl.valueChanges
      .pipe(
        skip(1),
        distinctUntilChanged(),
        debounceTime(this.delay)
      )
      .subscribe((value: string) => this.setFilter());
    // WAITING FOR INIT FILTER/SORT EVENT
    this.eventsSubscription = this.events.subscribe(() => {
      this.query = null;
      this.sessionStorage.clear(this.tableID + '_' + this.column.id);
      this.sessionStorage.clear(this.tableID + '_sorting_' + this.column.id);
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.eventsSubscription.unsubscribe();
  }
}
