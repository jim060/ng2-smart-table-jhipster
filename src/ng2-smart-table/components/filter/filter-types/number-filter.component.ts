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
     <input *ngSwitchCase="'before'" type="number"
            [formControl]="numBefore" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'after'" type="number"
            [formControl]="numAfter" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'equal'" type="number"
            [formControl]="numEqual" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'between'" type="number"
            [formControl]="startNum" [ngClass]="inputClass" class="form-control"/>
     <input *ngSwitchCase="'between'" type="number"
            [formControl]="endNum" [ngClass]="inputClass" class="form-control"/>
    </div>
  `,
})
export class NumberFilterComponent extends DefaultFilter implements OnInit {

  startNum = new FormControl();
  endNum = new FormControl();
  numBefore = new FormControl();
  numAfter = new FormControl();
  numEqual = new FormControl();
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
        .subscribe(val => {
          this.query = val;
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
        return this.numBefore.valueChanges.pipe(map(value => `_number_before_${value}`));
      }
      case 'after': {
        return this.numAfter.valueChanges.pipe(map(value => `_number_after_${value}`));
      }
      case 'equal': {
        return this.numEqual.valueChanges.pipe(map(value => `_number_equal_${value}`));
      }
      case 'between': {
        return combineLatest(this.startNum.valueChanges, this.endNum.valueChanges)
          .pipe(map(([val1, val2]) => {
            return `_start_number_${val1}_end_number_${val2}`;
          }));
      }
    }
  }
}
