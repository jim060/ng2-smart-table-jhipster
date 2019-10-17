import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DefaultFilter } from './default-filter';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'time-filter',
  template: `
    <select [formControl]="filterTypeSelect">
      <option [value]="option" *ngFor="let  option of filterOptions">{{labelOptions[option]}}</option>
    </select>
    <div [ngSwitch]="filterType">
     <input *ngSwitchCase="'before'" type="time"
            [formControl]="timeBefore" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'after'" type="time"
            [formControl]="timeAfter" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'equal'" type="time"
            [formControl]="timeEqual" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'between'" type="time"
            [formControl]="startTime" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'between'" type="time"
            [formControl]="endTime" [ngClass]="inputClass" class="form-control"/>
    </div>
  `,
})
export class TimeFilterComponent extends DefaultFilter implements OnInit {

  startTime = new FormControl();
  endTime = new FormControl();
  timeBefore = new FormControl();
  timeAfter = new FormControl();
  timeEqual = new FormControl();
  filterTypeSelect = new FormControl();
  filterType: string = 'equal';
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
        .subscribe((val: any) => {
          if (
            val === '_time_before_' ||
            val === '_time_after_' ||
            val === '_time_equal_') {
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

    this.filterTypeSelect.setValue('equal');
  }

  getFilterType() {
    switch (this.filterType) {
      case 'before': {
        return this.timeBefore.valueChanges.pipe(map(value => `_time_before_${value}`));
      }
      case 'after': {
        return this.timeAfter.valueChanges.pipe(map(value => `_time_after_${value}`));
      }
      case 'equal': {
        return this.timeEqual.valueChanges.pipe(map(value => `_time_equal_${value}`));
      }
      case 'between': {
        return combineLatest(this.startTime.valueChanges, this.endTime.valueChanges)
          .pipe(map(([val1, val2]) => {
            return `_start_time_${val1 === '' ? 'null' : val1}_end_time_${val2 === '' ? 'null' : val2}`;
          }));
      }
    }
  }
}