import {Component, Input, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import { CompleterService } from '@akveo/ng2-completer';

import { DefaultFilterTypeComponent } from './default-filter-type.component';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import {FormControl} from "@angular/forms";
import {SessionStorageService} from "ngx-webstorage";

@Component({
  selector: 'lib-completer-filter',
  template: `
    <ng2-completer [(ngModel)]="query"
                   (ngModelChange)="inputTextChanged($event)"
                   [dataService]="column.getFilterConfig().completer.dataService"
                   [minSearchLength]="column.getFilterConfig().completer.minSearchLength || 0"
                   [pause]="column.getFilterConfig().completer.pause || 0"
                   [placeholder]="column.getFilterConfig().completer.placeholder || 'Start typing...'"
                   (selected)="completerContent.next($event)">
    </ng2-completer>
  `,
})
export class CompleterFilterComponent extends DefaultFilterTypeComponent implements OnInit {
  @Input() tableID: string;
  @Input() events: Observable<void>;
  eventsSubscription: Subscription;
  completerContent = new Subject<any>();

  constructor(private completerService: CompleterService, private sessionStorage: SessionStorageService) {
    super();
  }

  ngOnInit() {
    const config = this.column.getFilterConfig().completer;
    config.dataService = this.completerService.local(config.data, config.searchFields, config.titleField);
    config.dataService.descriptionField(config.descriptionField);

    this.changesSubscription = this.completerContent
      .pipe(
        map((ev: any) => (ev && ev.title) || ev || ''),
        distinctUntilChanged(),
        debounceTime(this.delay)
      )
      .subscribe((search: string) => {
        this.query = search;
        this.setFilter();
      });
    // WAITING FOR INIT FILTER/SORT EVENT
    this.eventsSubscription = this.events.subscribe(() => {
      this.sessionStorage.clear(this.tableID + '_' + this.column.id);
      this.sessionStorage.clear(this.tableID + '_sorting_' + this.column.id);
    });
  }

  inputTextChanged(event: string) {
    // workaround to trigger the search event when the home/end buttons are clicked
    // when this happens the [(ngModel)]="query" is set to "" but the (selected) method is not called
    // so here it gets called manually
    if (event === '') {
      this.completerContent.next(event);
    }
  }
}
