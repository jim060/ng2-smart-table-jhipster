import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DefaultFilterTypeComponent } from './default-filter-type.component';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'lib-date-filter',
  template: `
    <select [formControl]="filterTypeSelect">
      <option [value]="option" *ngFor="let  option of filterOptions">{{labelOptions[option]}}</option>
    </select>
    <div [ngSwitch]="filterType">
     <input *ngSwitchCase="'before'" type="date"
            [formControl]="dateBefore" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'after'" type="date"
            [formControl]="dateAfter" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'equal'" type="date"
            [formControl]="dateEqual" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'between'" type="date"
            [formControl]="startDate" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'between'" type="date"
            [formControl]="endDate" [ngClass]="inputClass" class="form-control"/>
    </div>
  `,
})
export class DateFilterComponent extends DefaultFilterTypeComponent implements OnInit {

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

  constructor() {
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
            val === '_date_before_' ||
            val === '_date_after_' ||
            val === '_date_equal_') {
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
    if (querySplit[2] === 'before' || querySplit[2] === 'after' || querySplit[2] === 'equal') {
      this.filterType = querySplit[2];
      if (querySplit[3]) {
        const defaultValue = querySplit[3];
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
    } else if (querySplit[2] === 'date') {
      this.filterType = 'between';
      if (querySplit[3]) {
        const defaultValue = querySplit[3];
        const defaultEndValue = querySplit[6];
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
        return this.dateBefore.valueChanges.pipe(map(value => `_date_before_${value}`));
      }
      case 'after': {
        return this.dateAfter.valueChanges.pipe(map(value => `_date_after_${value}`));
      }
      case 'equal': {
        return this.dateEqual.valueChanges.pipe(map(value => `_date_equal_${value}`));
      }
      case 'between': {
        return combineLatest(this.startDate.valueChanges, this.endDate.valueChanges)
          .pipe(map(([val1, val2]) => {
            return `_start_date_${val1 === '' ? 'null' : val1}_end_date_${val2 === '' ? 'null' : val2}`;
          }));
      }
    }
  }
}
