import {Output, EventEmitter, Input, Component, OnInit, OnDestroy} from '@angular/core';

import { Column } from '../../lib/data-set/column';
import { DataSource } from '../../lib/data-source/data-source';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
  template: '',
})
export class FilterDefault implements OnInit, OnDestroy {

  @Input() column: Column;
  @Input() source: DataSource;
  @Input() language = 'en';
  @Input() inputClass: string = '';
  @Input() rememberFilter = false;
  @Input() tableID: string;

  @Output() filter = new EventEmitter<any>();
  @Output() columnLoaded = new EventEmitter<any>();

  query = '';

  constructor(protected sessionStorage: SessionStorageService) {
  }

  ngOnInit() {
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
