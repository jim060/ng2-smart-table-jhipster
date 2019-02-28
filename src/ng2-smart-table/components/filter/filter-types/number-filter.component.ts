import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DefaultFilter } from './default-filter';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'number-filter',
  template: `
    <select [formControl]="filterTypeSelect">
      <option [value]="option" *ngFor="let  option of filterOptions">{{labelOptions[option]}}</option>
    </select>
    <div [ngSwitch]="filterType">
     <input *ngSwitchCase="'before'" type="number" [formControl]="dateBefore" [ngClass]="inputClass" class="form-control">
     <input *ngSwitchCase="'after'" type="number" [formControl]="dateAfter" [ngClass]="inputClass" class="form-control">
     <input *ngSwitchCase="'equal'" type="number" [formControl]="dateEqual" [ngClass]="inputClass" class="form-control">
     <input *ngSwitchCase="'between'" type="number" [formControl]="startDate" [ngClass]="inputClass" class="form-control">
     <input *ngSwitchCase="'between'" type="number" [formControl]="endDate" [ngClass]="inputClass" class="form-control">
    </div>
  `,
})
export class NumberFilterComponent extends DefaultFilter implements OnInit {

  startDate = new FormControl();
  endDate = new FormControl();
  dateBefore = new FormControl();
  dateAfter = new FormControl();
  dateEqual = new FormControl();
  filterTypeSelect = new FormControl();
  filterType: string = 'equal';
  filterOptions = ['before', 'after', 'equal', 'between'];

  labelOptions = {};

  labelOptionsEn = {
    before: 'Min',
    after: 'Max',
    equal: 'Equal',
    between: 'Between',
  };

  labelOptionsFr = {
    before: 'Min',
    after: 'Max',
    equal: 'Egal',
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
        .subscribe(value => {
          this.query = value;
          this.setFilter()
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
        return this.dateBefore.valueChanges.pipe(map(value => '_number_before_' + value));
      }
      case 'after': {
        return this.dateAfter.valueChanges.pipe(map(value => '_number_after_' + value));
      }
      case 'equal': {
        return this.dateEqual.valueChanges.pipe(map(value => '_number_equal_' + value));
      }
      case 'between': {
        return combineLatest(this.startDate.valueChanges, this.endDate.valueChanges)
          .pipe(map(([val1, val2]) => {
            return '_start_number_' + val1 + '_end_number_' + val2;
          }));
      }
    }
  }
}
