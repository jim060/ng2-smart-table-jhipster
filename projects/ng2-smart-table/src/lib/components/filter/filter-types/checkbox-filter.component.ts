import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';

import { DefaultFilterTypeComponent } from './default-filter-type.component';
import { debounceTime } from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {SessionStorageService} from "ngx-webstorage";


@Component({
  selector: 'lib-checkbox-filter',
  template: `
    <input type="checkbox" [formControl]="inputControl" [ngClass]="inputClass" class="form-control">
    <a href="#" *ngIf="filterActive"
                (click)="resetFilter($event)">{{column.getFilterConfig()?.resetText || 'reset'}}</a>
  `,
})
export class CheckboxFilterComponent extends DefaultFilterTypeComponent implements OnInit, OnDestroy {
  @Input() events: Observable<void>;
  @Input() tableID: string;
  eventsSubscription: Subscription;
  filterActive = false;
  inputControl = new FormControl();

  constructor(private sessionStorage: SessionStorageService) {
    super();
  }

  ngOnInit() {
    this.changesSubscription = this.inputControl.valueChanges
      .pipe(debounceTime(this.delay))
      .subscribe((checked: boolean) => {
        this.filterActive = true;
        const trueVal = (this.column.getFilterConfig() && this.column.getFilterConfig().true) || true;
        const falseVal = (this.column.getFilterConfig() && this.column.getFilterConfig().false) || false;
        this.query = checked ? trueVal : falseVal;
        this.setFilter();
      });

    // WAITING FOR INIT FILTER/SORT EVENT
    this.eventsSubscription = this.events.subscribe(() => {
      this.inputControl.setValue(null);
      this.sessionStorage.clear(this.tableID + '_' + this.column.id);
      this.sessionStorage.clear(this.tableID + '_sorting_' + this.column.id);
    });
  }

  resetFilter(event: any) {
    event.preventDefault();
    this.query = '';
    this.inputControl.setValue(false, { emitEvent: false });
    this.filterActive = false;
    this.setFilter();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.eventsSubscription.unsubscribe();
  }
}
