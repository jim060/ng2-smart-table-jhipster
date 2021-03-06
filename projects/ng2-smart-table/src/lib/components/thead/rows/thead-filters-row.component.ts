import {Component, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy} from '@angular/core';

import { Grid } from '../../../lib/grid';
import { DataSource } from '../../../lib/data-source/data-source';
import {Observable, Subject, Subscription} from "rxjs";

@Component({
  selector: '[ng2-st-thead-filters-row]',
  template: `
    <th *ngIf="isMultiSelectVisible"></th>
    <th ng2-st-add-button *ngIf="showActionColumnLeft"
        [grid]="grid"
        (create)="create.emit($event)">
    </th>
    <th *ngFor="let column of grid.getColumns()" class="ng2-smart-th {{ column.id }}">
      <lib-ng2-smart-table-filter [source]="source"
                                  [column]="column"
                                  [language]="language"
                                  [inputClass]="filterInputClass"
                                  [rememberFilter]="rememberFilter"
                                  [tableID]="tableID"
                                  [initializeFilter]="initializeFilter"
                                  (columnLoaded)="ngAfterAllColumnsLoaded()"
                                  (filter)="filter.emit($event)"
                                  [events]="eventsSubject.asObservable()">
      </lib-ng2-smart-table-filter>
    </th>
    <th ng2-st-add-button *ngIf="showActionColumnRight"
        [grid]="grid"
        [source]="source"
        (create)="create.emit($event)">
    </th>
  `,
})
export class TheadFitlersRowComponent implements OnChanges, OnInit, OnDestroy {

  @Input() grid: Grid;
  @Input() source: DataSource;
  @Input() events: Observable<void>;

  @Output() create = new EventEmitter<any>();
  @Output() filter = new EventEmitter<any>();

  isMultiSelectVisible: boolean;
  showActionColumnLeft: boolean;
  showActionColumnRight: boolean;
  filterInputClass: string;
  language: string;
  rememberFilter: boolean;
  initializeFilter: boolean;
  tableID: string;
  countColumns: number;
  countColumnLoaded: number;
  eventsSubject: Subject<void> = new Subject<void>();
  eventsSubscription: Subscription;


  ngOnInit(): void {
     this.eventsSubscription = this.events.subscribe(() => {
     this.eventsSubject.next();
    });
  }

  ngAfterAllColumnsLoaded() {
    if (this.rememberFilter && this.tableID) {
      this.countColumnLoaded++;
      if (this.countColumnLoaded === this.countColumns) {
        // Emit OnChanged filter after all column filter init
        this.source.emitOnChanged('filter');
      }
    }
  }

  ngOnChanges() {
    this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
    this.showActionColumnLeft = this.grid.showActionColumn('left');
    this.showActionColumnRight = this.grid.showActionColumn('right');
    this.filterInputClass = this.grid.getSetting('filter.inputClass');
    this.language = this.grid.getSetting('language');
    this.rememberFilter = this.grid.getSetting('attr.rememberFilter');
    this.tableID = this.grid.getSetting('attr.id');
    this.initializeFilter = this.grid.getSetting('attr.initializeFilter');
    if (this.rememberFilter && this.tableID) {
      this.countColumnLoaded = 0;
      this.countColumns = this.grid.dataSet.getColumns().length;
    }
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
}
