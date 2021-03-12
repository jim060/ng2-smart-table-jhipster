import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';

import { DefaultFilterTypeComponent } from './default-filter-type.component';
import {Observable, Subscription} from "rxjs";
import {SessionStorageService} from "ngx-webstorage";

@Component({
  selector: 'lib-custom-column-filter',
  template: ``,
})
export class CustomColumnFilterComponent extends DefaultFilterTypeComponent implements OnInit {
  @Input() events: Observable<void>;
  @Input() tableID: string;
  eventsSubscription: Subscription;

  constructor(private sessionStorage: SessionStorageService) {
    super();
  }

  ngOnInit() {
    // WAITING FOR INIT FILTER/SORT EVENT
    this.eventsSubscription = this.events.subscribe(() => {
      this.sessionStorage.clear(this.tableID + '_' + this.column.id);
      this.sessionStorage.clear(this.tableID + '_sorting_' + this.column.id);
    });
  }

}
