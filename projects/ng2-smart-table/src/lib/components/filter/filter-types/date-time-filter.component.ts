import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';

import { DefaultFilterTypeComponent } from './default-filter-type.component';
import {combineLatest, Observable, Subject, Subscription} from 'rxjs';
import { map } from 'rxjs/operators';
import {SessionStorageService} from "ngx-webstorage";

@Component({
  selector: 'lib-date-time-filter',
  template: `
    <select [formControl]="filterTypeSelect">
      <option [value]="option" *ngFor="let  option of filterOptions">{{labelOptions[option]}}</option>
    </select>
    <div [ngSwitch]="filterType">
     <input *ngSwitchCase="'before'" type="datetime-local" step="1"
            [formControl]="dateBefore" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'after'" type="datetime-local" step="1"
            [formControl]="dateAfter" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'equal'" type="datetime-local" step="1"
            [formControl]="dateEqual" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'between'" type="datetime-local" step="1"
            [formControl]="startDate" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'between'" type="datetime-local" step="1"
            [formControl]="endDate" [ngClass]="inputClass" class="form-control"/>
    </div>
  `,
})
export class DateTimeFilterComponent extends DefaultFilterTypeComponent implements OnInit, OnDestroy {
  @Input() tableID: string;
  @Input() events: Observable<void>;
  eventsSubscription: Subscription;
  startDate = new FormControl();
  endDate = new FormControl();
  dateBefore = new FormControl();
  dateAfter = new FormControl();
  dateEqual = new FormControl();
  filterTypeSelect = new FormControl();
  filterType = 'equal';
  filterOptions = ['before', 'after', 'equal', 'between'];

  labelOptions = {};

  labelOptionsEn = {
    before: 'Before',
    after: 'After',
    equal: 'Equal',
    between: 'Between',
  };

  labelOptionsFr = {
    before: 'Avant',
    after: 'Après',
    equal: 'Egale',
    between: 'Entre',
  };

  constructor(private sessionStorage: SessionStorageService) {
    super();
  }

  ngOnInit() {
    this.changesSubscription2 = this.filterTypeSelect.valueChanges.subscribe(value => {
      this.filterType = value;
      if (this.changesSubscription) {
        this.changesSubscription.unsubscribe();
      }

      this.changesSubscription = this.getFilterType()
        .subscribe(val => {
          if (
            val === '_date_time_before_' ||
            val === '_date_time_after_' ||
            val === '_date_time_equal_') {
            this.query = `${val}null`;
          } else {
            this.query = val;
          }
          this.setFilter();
        });
    });

    if (this.language === 'fr') {
      this.labelOptions = Object.assign({}, this.labelOptionsFr);
    } else {
      this.labelOptions = Object.assign({}, this.labelOptionsEn);
    }

    if (this.query) {
      this.initRememberFilter();
    } else {
      this.initDefaultFilter();
    }
    // WAITING FOR INIT FILTER/SORT EVENT
    this.eventsSubscription = this.events.subscribe(() => {
      this.startDate.setValue(null);
      this.endDate.setValue(null);
      this.dateBefore.setValue(null);
      this.dateAfter.setValue(null);
      this.dateEqual.setValue(null);
      this.sessionStorage.clear(this.tableID + '_' + this.column.id);
      this.sessionStorage.clear(this.tableID + '_sorting_' + this.column.id);
    });
  }

  initDefaultFilter() {
    const config = this.column.getFilterConfig();
    if (config) {
      if (config.selectType) {
        this.filterType = config.selectType;
      }
      if (config.defaultValue) {
        switch (this.filterType) {
          case 'before': {
            this.dateBefore.setValue(config.defaultValue);
            break;
          }
          case 'after': {
            this.dateAfter.setValue(config.defaultValue);
            break;
          }
          case 'equal': {
            this.dateEqual.setValue(config.defaultValue);
            break;
          }
          case 'between': {
            this.startDate.setValue(config.defaultValue);
            if (config.defaultEndValue) {
              this.endDate.setValue(config.defaultEndValue);
            }
            break;
          }
        }
      }
    }
    this.filterTypeSelect.setValue(this.filterType);
  }

  initRememberFilter() {
    const querySplit = this.query.split('_');
    if (querySplit[3] === 'before' || querySplit[3] === 'after' || querySplit[3] === 'equal') {
      this.filterType = querySplit[3];
      if (querySplit[4]) {
        const defaultValue = querySplit[4];
        switch (this.filterType) {
          case 'before': {
            this.dateBefore.setValue(defaultValue);
            break;
          }
          case 'after': {
            this.dateAfter.setValue(defaultValue);
            break;
          }
          case 'equal': {
            this.dateEqual.setValue(defaultValue);
            break;
          }
        }
      }
      this.filterTypeSelect.setValue(this.filterType);
    } else if (querySplit[2] + '_' + querySplit[3] === 'date_time') {
      this.filterType = 'between';
      if (querySplit[4]) {
        const defaultValue = querySplit[4];
        const defaultEndValue = querySplit[8];
        this.startDate.setValue(defaultValue);
        if (defaultEndValue) {
          this.endDate.setValue(defaultEndValue);
        }
      }
      this.filterTypeSelect.setValue(this.filterType);
    }
  }

  getFilterType() {
    switch (this.filterType) {
      case 'before': {
        return this.dateBefore.valueChanges.pipe(map(value => `_date_time_before_${value}`));
      }
      case 'after': {
        return this.dateAfter.valueChanges.pipe(map(value => `_date_time_after_${value}`));
      }
      case 'equal': {
        return this.dateEqual.valueChanges.pipe(map(value => `_date_time_equal_${value}`));
      }
      case 'between': {
        return combineLatest(this.startDate.valueChanges, this.endDate.valueChanges)
          .pipe(map(([val1, val2]) => {
            return `_start_date_time_${val1 === '' ? 'null' : val1}_end_date_time_${val2 === '' ? 'null' : val2}`;
          }));
      }
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.eventsSubscription.unsubscribe();
  }
}
