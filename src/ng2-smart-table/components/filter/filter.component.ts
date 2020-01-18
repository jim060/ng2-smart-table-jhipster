import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, OnInit} from '@angular/core';

import { DataSource } from '../../lib/data-source/data-source';
import { Column } from '../../lib/data-set/column';
import { Subscription } from 'rxjs';
import {SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'ng2-smart-table-filter',
  styleUrls: ['./filter.component.scss'],
  template: `
    <div class="ng2-smart-filter" *ngIf="column.isFilterable" [ngSwitch]="column.getFilterType()">
      <select-filter *ngSwitchCase="'list'"
                     [query]="query"
                     [ngClass]="inputClass"
                     [column]="column"
                     (filter)="onFilter($event)">
      </select-filter>
      <checkbox-filter *ngSwitchCase="'checkbox'"
                       [query]="query"
                       [ngClass]="inputClass"
                       [column]="column"
                       (filter)="onFilter($event)">
      </checkbox-filter>
      <completer-filter *ngSwitchCase="'completer'"
                        [query]="query"
                        [ngClass]="inputClass"
                        [column]="column"
                        (filter)="onFilter($event)">
      </completer-filter>
      <date-filter *ngSwitchCase="'date'"
                        [query]="query"
                        [ngClass]="inputClass"
                        [column]="column"
                        [language]="language"
                        (filter)="onFilterDate($event)">
      </date-filter>
      <time-filter *ngSwitchCase="'time'"
                   [query]="query"
                   [ngClass]="inputClass"
                   [column]="column"
                   [language]="language"
                   (filter)="onFilterTime($event)">
      </time-filter>
      <number-filter *ngSwitchCase="'number'"
                   [query]="query"
                   [ngClass]="inputClass"
                   [column]="column"
                   [language]="language"
                   (filter)="onFilterNumber($event)">
      </number-filter>
      <mselect-filter *ngSwitchCase="'multiple'"
                        [query]="query"
                        [ngClass]="inputClass"
                        [column]="column"
                        [language]="language"
                        (filter)="onFilterMulti($event)">
      </mselect-filter>
      <input-filter *ngSwitchDefault
                    [query]="query"
                    [ngClass]="inputClass"
                    [column]="column"
                    (filter)="onFilter($event)">
      </input-filter>
    </div>
  `,
})
export class FilterComponent implements OnChanges, OnDestroy, OnInit {

  @Input() column: Column;
  @Input() source: DataSource;
  @Input() language: string = 'en';
  @Input() inputClass: string = '';
  @Input() rememberFilter: boolean = false;
  @Input() tableID: string;

  @Output() filter = new EventEmitter<any>();
  @Output() columnLoaded = new EventEmitter<any>();

  query: string = '';

  protected dataChangedSub: Subscription;

  constructor(private sessionStorage: SessionStorageService) {}

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.source) {
      if (!changes.source.firstChange) {
        this.dataChangedSub.unsubscribe();
      }
      this.dataChangedSub = this.source.onChanged().subscribe((dataChanges) => {
        const filterConf = this.source.getFilter();
        if (filterConf && filterConf.filters && filterConf.filters.length === 0) {
          this.query = '';

          // add a check for existing filters an set the query if one exists for this column
          // this covers instances where the filter is set by user code while maintaining existing functionality
        } else if (filterConf && filterConf.filters && filterConf.filters.length > 0) {
          filterConf.filters.forEach((k: any, v: any) => {
            if (k.field == this.column.id) {
              this.query = k.search;
            }
          });
        }
      });
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
