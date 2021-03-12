import {Component, Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';

import { DefaultFilterTypeComponent } from './default-filter-type.component';
import {combineLatest, Observable, Subject, Subscription} from 'rxjs';
import { map } from 'rxjs/operators';
import {SessionStorageService} from "ngx-webstorage";

@Component({
  selector: 'lib-number-filter',
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
export class NumberFilterComponent extends DefaultFilterTypeComponent implements OnInit {
  @Input() tableID: string;
  @Input() events: Observable<void>;
  eventsSubscription: Subscription;
  startNum = new FormControl();
  endNum = new FormControl();
  numBefore = new FormControl();
  numAfter = new FormControl();
  numEqual = new FormControl();
  filterTypeSelect = new FormControl();
  filterType = 'equal';
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
          this.query = val;
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
      this.startNum.setValue(null);
      this.endNum.setValue(null);
      this.numBefore.setValue(null);
      this.numAfter.setValue(null);
      this.numEqual.setValue(null);
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
            this.numBefore.setValue(config.defaultValue);
            break;
          }
          case 'after': {
            this.numAfter.setValue(config.defaultValue);
            break;
          }
          case 'equal': {
            this.numEqual.setValue(config.defaultValue);
            break;
          }
          case 'between': {
            this.startNum.setValue(config.defaultValue);
            if (config.defaultEndValue) {
              this.endNum.setValue(config.defaultEndValue);
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
            this.numBefore.setValue(defaultValue);
            break;
          }
          case 'after': {
            this.numAfter.setValue(defaultValue);
            break;
          }
          case 'equal': {
            this.numEqual.setValue(defaultValue);
            break;
          }
        }
      }
      this.filterTypeSelect.setValue(this.filterType);
    } else if (querySplit[2] === 'number') {
      this.filterType = 'between';
      if (querySplit[3]) {
        const defaultValue = querySplit[3];
        const defaultEndValue = querySplit[6];
        this.startNum.setValue(defaultValue);
        if (defaultEndValue) {
          this.endNum.setValue(defaultEndValue);
        }
      }
      this.filterTypeSelect.setValue(this.filterType);
    }
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
