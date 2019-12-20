import { Component, OnInit } from '@angular/core';
import { DefaultFilter } from './default-filter';
import { deepExtend } from '../../../lib/helpers';

export interface Config {
    dropdownList: [];
    selectedItems: [];
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
}

// See : https://cuppalabs.github.io/angular2-multiselect-dropdown/#/basic
@Component({
    selector: 'mselect-filter',
    template: `<angular2-multiselect [data]="dropdownList" 
    [(ngModel)]="selectedItems" 
    [settings]="dropdownSettings" 
    (onSelect)="onItemSelect($event)"
    (onDeSelect)="OnItemDeSelect($event)" 
    (onSelectAll)="onSelectAll($event)" 
    (onDeSelectAll)="onDeSelectAll($event)">
    </angular2-multiselect>`,
})
export class MselectFilterComponent extends DefaultFilter implements OnInit {
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

    constructor() {
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
