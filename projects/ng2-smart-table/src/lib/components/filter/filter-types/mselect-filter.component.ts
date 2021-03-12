import {Component, Input, OnInit} from '@angular/core';
import { DefaultFilterTypeComponent } from './default-filter-type.component';
import { deepExtend } from '../../../lib/helpers';
import {Observable, Subscription} from "rxjs";
import {FormControl} from "@angular/forms";
import {SessionStorageService} from "ngx-webstorage";

export interface Config {
    dropdownList: any[];
    selectedItems: any[];
    dropdownSettings: DropdownSettings;
}
export interface DropdownSettings {
    singleSelection?: boolean;
    text?: string;
    selectAllText?: string;
    unSelectAllText?: string;
    enableSearchFilter?: boolean;
    searchPlaceholderText?: string;
    enableFilterSelectAll?: boolean;
    filterSelectAllText?: string;
    filterUnSelectAllText?: string;
    noDataLabel?: string;
    showCheckbox?: boolean;
    classes?: string;
    lazyLoading?: boolean;
}

// See : https://cuppalabs.github.io/angular2-multiselect-dropdown/#/basic
@Component({
    selector: 'lib-mselect-filter',
    template: `<angular2-multiselect [data]="dropdownList"
    [(ngModel)]="selectedItems"
    [settings]="dropdownSettings"
    (onSelect)="onItemSelect($event)"
    (onDeSelect)="OnItemDeSelect($event)"
    (onSelectAll)="onSelectAll($event)"
    (onDeSelectAll)="onDeSelectAll($event)">
    </angular2-multiselect>`,
})
export class MselectFilterComponent extends DefaultFilterTypeComponent implements OnInit {
  @Input() events: Observable<void>;
  @Input() tableID: string;
  eventsSubscription: Subscription;
    dropdownList: any[] = [];
    selectedItems: any[] = [];
    dropdownSettings: DropdownSettings = {};

    setting = {
      singleSelection: false,
      text: 'Select',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      searchPlaceholderText: 'Search',
      enableFilterSelectAll: true,
      filterSelectAllText: 'Select all filtered results',
      filterUnSelectAllText: 'UnSelect all filtered results',
      noDataLabel: 'No Data Available',
      showCheckbox: true,
      classes: '',
      lazyLoading: true,
    };

    settingFr = {
      text: 'Sélectionner',
      selectAllText: 'Tous',
      unSelectAllText: 'Aucun',
      searchPlaceholderText: 'Rechercher',
      filterSelectAllText: 'Tous les résultats',
      filterUnSelectAllText: 'Aucun des résultats',
      noDataLabel: 'Aucune donnée disponible',
    };

    constructor(private sessionStorage: SessionStorageService) {
        super();
    }

    ngOnInit() {
        const config: Config = this.column.getFilterConfig();
        this.dropdownList = config.dropdownList || [];
        this.selectedItems = config.selectedItems || [];

        if (this.language === 'fr') {
          this.dropdownSettings = Object.assign(
            deepExtend({}, this.setting, this.settingFr),
            config.dropdownSettings,
          );
        } else {
          this.dropdownSettings = Object.assign(this.setting, config.dropdownSettings);
        }

        this.eventsSubscription = this.events.subscribe(() => {
          this.selectedItems = [];
          this.column.filter.config.selectedItems = [];
          this.sessionStorage.clear(this.tableID + '_' + this.column.id);
          this.sessionStorage.clear(this.tableID + '_' + this.column.id + '_selectedItems');
          this.sessionStorage.clear(this.tableID + '_sorting_' + this.column.id);

        });
    }
    onItemSelect(item: any) {
        this.updateQuery();
    }
    OnItemDeSelect(item: any) {
        this.updateQuery();
    }
    onSelectAll(items: any) {
        this.updateQuery();
    }
    onDeSelectAll(items: any) {
        this.updateQuery();
    }
    updateQuery() {
        // this.query = this.selectedItems.map(item => item.itemName).join(';').replace(/ /g, '');
        this.query = this.selectedItems.map(item => item.itemName).join(';');
        this.setFilter();
    }
}
