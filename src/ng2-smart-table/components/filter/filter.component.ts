import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { DataSource } from '../../lib/data-source/data-source';
import { Column } from '../../lib/data-set/column';
import { Subscription } from 'rxjs';

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
export class FilterComponent implements OnChanges {

  @Input() column: Column;
  @Input() source: DataSource;
  @Input() language: string = 'en';
  @Input() inputClass: string = '';

  @Output() filter = new EventEmitter<any>();

  query: string = '';

  protected dataChangedSub: Subscription;

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

  onFilter(query: string) {
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
    });
  }

  onFilterMulti(query: string) {
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
      multiSearch: true,
    });
  }

  onFilterDate(query: string) {
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
      dateSearch: true,
    });
  }

  onFilterTime(query: string) {
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
      timeSearch: true,
    });
  }

  onFilterNumber(query: string) {
    this.source.addFilter({
      field: this.column.id,
      search: query,
      filter: this.column.getFilterFunction(),
      numberSearch: true,
    });
  }
}
