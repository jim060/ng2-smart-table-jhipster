import {Output, EventEmitter, Input, Component, OnInit, OnDestroy} from '@angular/core';

import { Column } from '../../lib/data-set/column';
import { DataSource } from '../../lib/data-source/data-source';
import {SessionStorageService} from 'ngx-webstorage';
import {unique} from "ng-packagr/lib/utils/array";
import {unwrapConstructorDependencies} from "@angular/compiler-cli/src/ngtsc/annotations/src/util";

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

    //  ON LOAD MULTi SELECT FILTER TO BE APPLIED
    if (this.column.getFilterType() === 'multiple' &&  this.initializeFilter && this.column.filter.config.selectedItems.length > 0) {
      let query: string | any = '';
      this.column.filter.config.selectedItems.forEach(element => {
        query += element.itemName + ';'; });
      query = query.slice(0, -1);
      this.onFilterMulti(query, true);
      //  ON LOAD NUMBER FILTER TO BE APPLIED
    } else if (this.column.getFilterType() === 'number' && this.initializeFilter && this.column.filter.config.selectType !== undefined) {
      if (!this.column.filter.config.selectType.toString().toLowerCase().includes('between')) {
        this.onFilterNumber( '_number_' + this.column.filter.config.selectType  + '_' +
          this.column.filter.config.defaultValue , true);
      }  else {
        this.onFilterNumber( '_start_number_' + this.column.filter.config.defaultValue  + '_end_number_' +
          this.column.filter.config.defaultEndValue , true);
      }
      //  ON LOAD DATE FILTER TO BE APPLIED
    } else if (this.column.getFilterType() === 'date' && this.initializeFilter && this.column.filter.config.selectType !== undefined) {
      if (!this.column.filter.config.selectType.toString().toLowerCase().includes('between')) {
        this.onFilterDate( '_date_' + this.column.filter.config.selectType  + '_' +
          this.column.filter.config.defaultValue , true);
      } else {
        this.onFilterDate( '_start_date_' + this.column.filter.config.defaultValue  + '_end_date_' +
          this.column.filter.config.defaultEndValue , true);
      }
      //  ON LOAD TIME FILTER TO BE APPLIED
    } else if (this.column.getFilterType() === 'time' && this.initializeFilter && this.column.filter.config.selectType !== undefined) {
      if (!this.column.filter.config.selectType.toString().toLowerCase().includes('between')) {
        this.onFilterTime( '_time_' + this.column.filter.config.selectType  + '_' +
          this.column.filter.config.defaultValue , true);
      } else {
        this.onFilterTime( '_start_time_' + this.column.filter.config.defaultValue  + '_end_time_' +
          this.column.filter.config.defaultEndValue , true);
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
  }

  ngOnDestroy() {
    // Store column filter if rememberFilter mode is activate
    if (this.rememberFilter && this.tableID) {
      this.sessionStorage.clear(this.tableID + '_' + this.column.id);
      this.sessionStorage.store(this.tableID + '_' + this.column.id, this.query);
      const filter = this.column.filter;
      if (filter) {
        const type = filter.type;
        if (type === 'multiple') {
          // Si multiple, on stock les items sélectionnés égalements.
          this.sessionStorage.clear(this.tableID + '_' + this.column.id + '_selectedItems');
          this.sessionStorage.store(this.tableID + '_' + this.column.id + '_selectedItems', filter.config.selectedItems);
        }
      }
    }
  }

  onFilter(query: string, doEmit = true) {
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
    }, true, doEmit);
  }

  onFilterMulti(query: string, doEmit = true) {
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
      multiSearch: true,
    }, true, doEmit);
  }

  onFilterDate(query: string, doEmit = true) {
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
      dateSearch: true,
    }, true, doEmit);
  }

  onFilterTime(query: string, doEmit = true) {

    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
      timeSearch: true,
    }, true, doEmit);
  }

  onFilterNumber(query: string, doEmit = true) {
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
      numberSearch: true,
    }, true, doEmit);
  }
}
