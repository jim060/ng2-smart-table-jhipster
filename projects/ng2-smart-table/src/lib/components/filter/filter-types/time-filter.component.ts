import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';

import { DefaultFilterTypeComponent } from './default-filter-type.component';
import {combineLatest, Observable, Subject, Subscription} from 'rxjs';
import { map } from 'rxjs/operators';
import {SessionStorageService} from "ngx-webstorage";

@Component({
  selector: 'lib-time-filter',
  template: `
    <select [formControl]="filterTypeSelect">
      <option [value]="option" *ngFor="let  option of filterOptions">{{labelOptions[option]}}</option>
    </select>
    <div [ngSwitch]="filterType">
     <input *ngSwitchCase="'before'" type="time" step="1"
            [formControl]="timeBefore" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'after'" type="time" step="1"
            [formControl]="timeAfter" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'equal'" type="time" step="1"
            [formControl]="timeEqual" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'between'" type="time" step="1"
            [formControl]="startTime" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'between'" type="time" step="1"
            [formControl]="endTime" [ngClass]="inputClass" class="form-control"/>
    </div>
  `,
})
export class TimeFilterComponent extends DefaultFilterTypeComponent implements OnInit, OnDestroy {
  @Input() tableID: string;
  @Input() events: Observable<void>;
  eventsSubscription: Subscription;
  startTime = new FormControl();
  endTime = new FormControl();
  timeBefore = new FormControl();
  timeAfter = new FormControl();
  timeEqual = new FormControl();
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
        .subscribe((val: any) => {
          if (
            val === '_time_before_' ||
            val === '_time_after_' ||
            val === '_time_equal_') {
            this.query = `${val}null`;

          } else if (!val.includes('null')) {
            this.query = val;
            this.setFilter();
          }
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
      this.startTime.setValue(null);
      this.endTime.setValue(null);
      this.timeBefore.setValue(null);
      this.timeAfter.setValue(null);
      this.timeEqual.setValue(null);
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
            this.timeBefore.setValue(config.defaultValue);
            break;
          }
          case 'after': {
            this.timeAfter.setValue(config.defaultValue);
            break;
          }
          case 'equal': {
            this.timeEqual.setValue(config.defaultValue);
            break;
          }
          case 'between': {
            this.startTime.setValue(config.defaultValue);
            if (config.defaultEndValue) {
              this.endTime.setValue(config.defaultEndValue);
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
    if (querySplit[2] === 'before' || querySplit[2] === 'after' || querySplit[2] === 'equal') {
      this.filterType = querySplit[2];
      if (querySplit[3]) {
        const defaultValue = querySplit[3];
        switch (this.filterType) {
          case 'before': {
            this.timeBefore.setValue(defaultValue);
            break;
          }
          case 'after': {
            this.timeAfter.setValue(defaultValue);
            break;
          }
          case 'equal': {
            this.timeEqual.setValue(defaultValue);
            break;
          }
        }
      }
      this.filterTypeSelect.setValue(this.filterType);
    } else if (querySplit[2] === 'time') {
      this.filterType = 'between';
      if (querySplit[3]) {
        const defaultValue = querySplit[3];
        const defaultEndValue = querySplit[6];
        this.startTime.setValue(defaultValue);
        if (defaultEndValue) {
          this.endTime.setValue(defaultEndValue);
        }
      }
      this.filterTypeSelect.setValue(this.filterType);
    }
  }

  getFilterType() {
    switch (this.filterType) {
      case 'before': {
        return this.timeBefore.valueChanges.pipe(map(value =>  value !== null ? `_time_before_${value}`  : ''));
      }
      case 'after': {
        return this.timeAfter.valueChanges.pipe(map(value =>  value !== null ? `_time_after_${value}`  : ''));
      }
      case 'equal': {
        return this.timeEqual.valueChanges.pipe(map(value => value !== null ?  `_time_equal_${value}` : ''));
      }
      case 'between': {
        return combineLatest(this.startTime.valueChanges, this.endTime.valueChanges)
          .pipe(map(([val1, val2]) => {
            return  val1  !== null  && val2 !== null ?   `_start_time_${val1}_end_time_${val2}` : '';
          }));
      }
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.eventsSubscription.unsubscribe();
  }
}
