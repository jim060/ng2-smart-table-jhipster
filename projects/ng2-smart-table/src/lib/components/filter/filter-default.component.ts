import {Output, EventEmitter, Input, Component, OnInit, OnDestroy} from '@angular/core';

import { Column } from '../../lib/data-set/column';
import { DataSource } from '../../lib/data-source/data-source';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
  template: '',
})
export class FilterDefaultComponent implements OnInit, OnDestroy {

  @Input() column: Column;
  @Input() source: DataSource;
  @Input() language = 'en';
  @Input() inputClass = '';
  @Input() rememberFilter = false;
  @Input() initializeFilter = false;
  @Input() tableID: string;

  @Output() filter = new EventEmitter<any>();
  @Output() columnLoaded = new EventEmitter<any>();

  query = '';

  constructor(protected sessionStorage: SessionStorageService) {

  }

  ngOnInit() {
    //  ON LOAD MULTI SELECT FILTER INIT
    if ( this.initializeFilter && this.column.getFilterType() === 'multiple' &&  this.column.filter.config.selectedItems) {
      let query: string | any = '';
      this.column.filter.config.selectedItems.forEach(element => {
        query += element.itemName + ';'; });
      query = query.slice(0, -1);
      this.onFilterMulti(query, false);
      //  ON LOAD NUMBER FILTER INIT
    } else if ( this.initializeFilter && this.column.getFilterType() === 'number' &&   this.column.filter.config ) {
      if (!this.column.filter.config.selectType.toString().toLowerCase().includes('between')) {
        this.onFilterNumber( '_number_' + this.column.filter.config.selectType  + '_' +
          this.column.filter.config.defaultValue , false);
      }  else {
        this.onFilterNumber( '_start_number_' + this.column.filter.config.defaultValue  + '_end_number_' +
          this.column.filter.config.defaultEndValue , false);
      }
      //  ON LOAD DATE FILTER INIT
    } else if (this.initializeFilter && this.column.getFilterType() === 'date'  &&  this.column.filter.config) {
      if (!this.column.filter.config.selectType.toString().toLowerCase().includes('between')) {
        this.onFilterDate( '_date_' + this.column.filter.config.selectType  + '_' +
          this.column.filter.config.defaultValue , false);
      } else {
        this.onFilterDate( '_start_date_' + this.column.filter.config.defaultValue  + '_end_date_' +
          this.column.filter.config.defaultEndValue , false);
      }
      //  ON LOAD TIME FILTER INIT
    } else if (this.initializeFilter  && this.column.getFilterType() === 'date-time'  &&  this.column.filter.config) {
      if (!this.column.filter.config.selectType.toString().toLowerCase().includes('between')) {
        this.onFilterDateTime( '_date_time_' + this.column.filter.config.selectType  + '_' +
          this.column.filter.config.defaultValue , false);
      } else {
        this.onFilterDateTime( '_start_date_time_' + this.column.filter.config.defaultValue  + '_end_date_time_' +
          this.column.filter.config.defaultEndValue , false);
      }
    }
    // retrieve column filter if rememberFilter mode is activate
    if (this.rememberFilter && this.tableID) {
      this.query = this.sessionStorage.retrieve(this.tableID + '_' + this.column.id);
      if (this.query) {
        const filter = this.column.filter;
        if (filter) {
          const type = filter.type;

          switch (type) {
            case 'multiple':
              filter.config.selectedItems = this.sessionStorage.retrieve(this.tableID + '_' + this.column.id + '_selectedItems');
              this.onFilterMulti(this.query, false);
              break;
            case 'date':
              this.onFilterDate(this.query, false);
              break;
            case 'time':
              this.onFilterTime(this.query, false);
              break;
            case 'date-time':
              this.onFilterDateTime(this.query, false);
              break;
            case 'number':
              this.onFilterNumber(this.query, false);
              break;
            default:
              this.onFilter(this.query, false);
              break;
          }
        } else {
          this.onFilter(this.query, false);
        }
      }
      this.columnLoaded.emit(this.column.id);
    }
    // CHECK IF THERE IS A SAVED SORTING ON CURRENT COLUMN
    if (this.sessionStorage.retrieve(this.tableID + '_sorting_' + this.column.id) !== null) {
      // ADD SAVED SORTING MODE TO DATA_SOURCE
      this.source.setSort([{
        field: this.column.id,
        direction: this.sessionStorage.retrieve(this.tableID + '_sorting_' + this.column.id),
        compare: undefined
      }], false);
    }
  }

  ngOnDestroy() {
    // Store column filter if rememberFilter mode is activate
    if (this.rememberFilter && this.tableID) {
      this.sessionStorage.clear(this.tableID + '_' + this.column.id);
      if (this.query && this.query !== '' && !this.query.includes('null')) {

        this.sessionStorage.store(this.tableID + '_' + this.column.id, this.query);
      }
      const filter = this.column.filter;
      if (filter) {
        const type = filter.type;
        if (type === 'multiple' && filter.config.selectedItems && filter.config.selectedItems.length > 0) {
          // Si multiple, on stock les items sélectionnés égalements.
          this.sessionStorage.clear(this.tableID + '_' + this.column.id + '_selectedItems');
          this.sessionStorage.store(this.tableID + '_' + this.column.id + '_selectedItems', filter.config.selectedItems);
        }
      }
      // CHECK IF THERE IS AN ACTIVATED SORTING MODE
      if (this.source.getSort().length > 0) {
        // CHECK IF THERE IS ALREADY A SAVED SORTING MODE FOR THE CURRENT COLUMN
        if (this.sessionStorage.retrieve(this.tableID + '_sorting_' + this.column.id) !== null) {
          // IF YES DELETE CURRENT SORTING MODE
          this.sessionStorage.clear(this.tableID + '_sorting_' + this.column.id);
        }
        // CONDITION USED TO SAVE ONLY ONE TIME SORTING MODE (FOR PERFORMANCE PURPOSE)
        if ( this.column.id  ===  this.source.getSort()[0].field ) {
          // SAVE THE NEW SORTING MODE
          this.sessionStorage.store(this.tableID + '_sorting_' + this.source.getSort()[0].field, this.source.getSort()[0].direction);
        }
      }
    }


  }

  onFilter(query: string, doEmit = true) {
    if (doEmit === true ) {
      doEmit = query !== null;
    }
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
    }, true, doEmit);
  }

  onFilterMulti(query: string, doEmit = true) {
    if (doEmit === true ) {
      doEmit = query !== '' && query !== null;
    }
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
      multiSearch: true,
    }, true, doEmit);
  }

  onFilterDate(query: string, doEmit = true) {
    if (doEmit === true ) {
      doEmit = query !== '' && query !== null;
    }
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
      dateSearch: true,
    }, true, doEmit);
  }

  onFilterTime(query: string, doEmit = true) {
    if (doEmit === true ) {
      doEmit = query !== '' && query !== null;
    }
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
      timeSearch: true,
    }, true, doEmit);
  }

  onFilterDateTime(query: string, doEmit = true) {
    if (doEmit === true ) {
      doEmit = query !== '' && query !== null;
    }
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
      dateTimeSearch: true,
    }, true, doEmit);
  }

  onFilterNumber(query: string, doEmit = true) {
    if (doEmit === true ) {
      doEmit = query !== '' && query !== null;
    }
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
      numberSearch: true,
    }, true, doEmit);
  }
}
