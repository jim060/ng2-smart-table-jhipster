import {Component, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy} from '@angular/core';

import { Grid } from '../../lib/grid';
import { DataSource } from '../../lib/data-source/data-source';
import {Observable, Subject, Subscription} from 'rxjs';

@Component({
    selector: '[ng2-st-thead]',
    templateUrl: './thead.component.html',
})
export class Ng2SmartTableTheadComponent implements OnChanges, OnInit, OnDestroy {

    @Input() grid: Grid;
    @Input() source: DataSource;
    @Input() isAllSelected: boolean;
    @Input() createConfirm: EventEmitter<any>;
    @Input() events: Observable<void>;

    @Output() sort = new EventEmitter<any>();
    @Output() selectAllRows = new EventEmitter<any>();
    @Output() create = new EventEmitter<any>();
    @Output() filter = new EventEmitter<any>();


    isHideHeader: boolean;
    isHideSubHeader: boolean;
    eventsSubject: Subject<void> = new Subject<void>();
    eventsSubscription: Subscription;

    ngOnInit(): void {
      this.eventsSubscription = this.events.subscribe(() => {
        this.eventsSubject.next();
      });
    }

  ngOnChanges() {
    this.isHideHeader = this.grid.getSetting('hideHeader');
    this.isHideSubHeader = this.grid.getSetting('hideSubHeader');
  }


  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
}
