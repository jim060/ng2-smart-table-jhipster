import {
  Component,
  Input,
  Output,
  SimpleChange,
  EventEmitter,
  OnChanges,
  OnDestroy,
  OnInit,
  AfterContentInit
} from '@angular/core';

import { Grid } from './lib/grid';
import { DataSource } from './lib/data-source/data-source';
import { Row } from './lib/data-set/row';
import { deepExtend } from './lib/helpers';
import { LocalDataSource } from './lib/data-source/local/local.data-source';
import {SessionStorageService} from 'ngx-webstorage';
import {Subject} from 'rxjs';

@Component({
  // TSLINT:DISABLE TO DISABLE VERIFICATION ON THIS SELECTOR (lib-ng2-smart-table)
  // tslint:disable-next-line:component-selector
  selector: 'ng2-smart-table',
  styleUrls: ['./ng2-smart-table.component.scss'],
  templateUrl: './ng2-smart-table.component.html',
})
export class Ng2SmartTableComponent implements OnChanges {

  @Input() source: any;
  @Input() settings = {};

  @Output() rowSelect = new EventEmitter<any>();
  @Output() userRowSelect = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() create = new EventEmitter<any>();
  @Output() custom = new EventEmitter<any>();
  @Output() deleteConfirm = new EventEmitter<any>();
  @Output() editConfirm = new EventEmitter<any>();
  @Output() createConfirm = new EventEmitter<any>();
  @Output() rowHover: EventEmitter<any> = new EventEmitter<any>();

  eventsSubject: Subject<void> = new Subject<void>();

  tableClass: string;
  tableId: string;
  tableRememberFilter: boolean;
  perPageSelect: any;
  isHideHeader: boolean;
  isHideSubHeader: boolean;
  isPagerDisplay: boolean;
  rowClassFunction: Function;
  language = 'en';
  buttonFilterInitText = 'Reset filters';

  grid: Grid;
  defaultSettings = {
    mode: 'inline', // inline|external|click-to-edit
    selectMode: 'single', // single|multi
    language: 'en', // en|fr
    hideHeader: false,
    hideSubHeader: false,
    actions: {
      columnTitle: 'Actions',
      add: true,
      edit: true,
      delete: true,
      custom: [],
      position: 'left', // left|right
    },
    filter: {
      inputClass: '',
    },
    edit: {
      inputClass: '',
      editButtonContent: 'Edit',
      saveButtonContent: 'Update',
      cancelButtonContent: 'Cancel',
      confirmSave: false,
    },
    add: {
      inputClass: '',
      addButtonContent: 'Add New',
      createButtonContent: 'Create',
      cancelButtonContent: 'Cancel',
      confirmCreate: false,
    },
    delete: {
      deleteButtonContent: 'Delete',
      confirmDelete: false,
    },
    attr: {
      id: '',
      class: '',
      rememberFilter: false,
    },
    noDataMessage: 'No data found',
    columns: {},
    pager: {
      display: true,
      perPage: 10,
    },
    rowClassFunction: () => '',
  };

  defaultSettingsFr = {
    edit: {
      editButtonContent: 'Modifier',
      saveButtonContent: 'Enregistrer',
      cancelButtonContent: 'Annuler',
    },
    add: {
      addButtonContent: 'Ajouter',
      createButtonContent: 'Créer',
      cancelButtonContent: 'Annuler',
    },
    delete: {
      deleteButtonContent: 'Supprimer',
    },
    noDataMessage: 'Aucune donnée disponible',
  };

  isAllSelected = false;

  constructor() {}

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (this.grid) {
      if (changes.settings) {
        this.grid.setSettings(this.prepareSettings());
      }
      if (changes.source) {
        this.source = this.prepareSource();
        this.grid.setSource(this.source);
      }
    } else {
      this.initGrid();
    }
    this.tableId = this.grid.getSetting('attr.id');
    this.tableClass = this.grid.getSetting('attr.class');
    this.tableRememberFilter = this.grid.getSetting('attr.rememberFilter');
    this.isHideHeader = this.grid.getSetting('hideHeader');
    this.isHideSubHeader = this.grid.getSetting('hideSubHeader');
    this.isPagerDisplay = this.grid.getSetting('pager.display');
    this.isPagerDisplay = this.grid.getSetting('pager.display');
    this.perPageSelect = this.grid.getSetting('pager.perPageSelect');
    this.rowClassFunction = this.grid.getSetting('rowClassFunction');
    this.language = this.grid.getSetting('language');
    this.buttonFilterInitText =  typeof(this.grid.getSetting('attr.buttonFilterInitText')) === 'string' ? this.grid.getSetting('attr.buttonFilterInitText') :
      this.getInitFiltersBtnText(this.grid.getSetting('language'));

  }


  getInitFiltersBtnText(language: string): string {
    if (language === 'fr') {
      return 'Réinitialiser les filtres';
    } else {
      return 'Reset filters';
    }
  }

  editRowSelect(row: Row) {
    if (this.grid.getSetting('selectMode') === 'multi') {
      this.onMultipleSelectRow(row);
    } else {
      this.onSelectRow(row);
    }
  }

  onUserSelectRow(row: Row) {
    if (this.grid.getSetting('selectMode') !== 'multi') {
      this.grid.selectRow(row);
      this.emitUserSelectRow(row);
      this.emitSelectRow(row);
    }
  }

  onRowHover(row: Row) {
    this.rowHover.emit(row);
  }

  multipleSelectRow(row: Row) {
    this.grid.multipleSelectRow(row);
    this.emitUserSelectRow(row);
    this.emitSelectRow(row);
  }

  onSelectAllRows($event: any) {
    this.isAllSelected = !this.isAllSelected;
    this.grid.selectAllRows(this.isAllSelected);

    this.emitUserSelectRow(null);
    this.emitSelectRow(null);
  }

  onSelectRow(row: Row) {
    this.grid.selectRow(row);
    this.emitSelectRow(row);
  }

  onMultipleSelectRow(row: Row) {
    this.emitSelectRow(row);
  }

  initGrid() {
    this.source = this.prepareSource();
    this.grid = new Grid(this.source, this.prepareSettings());
    this.grid.onSelectRow().subscribe((row) => this.emitSelectRow(row));
  }

  prepareSource(): DataSource {
    if (this.source instanceof DataSource) {
      return this.source;
    } else if (this.source instanceof Array) {
      return new LocalDataSource(this.source);
    }

    return new LocalDataSource();
  }

  prepareSettings(): object {
    if ((this.settings as any).language === 'fr') {
      return deepExtend({}, this.defaultSettings, this.defaultSettingsFr, this.settings);
    } else {
      return deepExtend({}, this.defaultSettings, this.settings);
    }
  }

  changePage($event: any) {
    this.resetAllSelector();
  }

  sort($event: any) {
    this.resetAllSelector();
  }

  filter($event: any) {
    this.resetAllSelector();
  }

  private resetAllSelector() {
    this.isAllSelected = false;
  }

  private emitUserSelectRow(row: Row) {
    const selectedRows = this.grid.getSelectedRows();

    this.userRowSelect.emit({
      data: row ? row.getData() : null,
      isSelected: row ? row.getIsSelected() : null,
      source: this.source,
      selected: selectedRows && selectedRows.length ? selectedRows.map((r: Row) => r.getData()) : [],
    });
  }

  private emitSelectRow(row: Row) {
    this.rowSelect.emit({
      data: row ? row.getData() : null,
      isSelected: row ? row.getIsSelected() : null,
      source: this.source,
    });
  }


  /**
   * @description INIT FILTERS & SORTING MODE
   */
  initFiltersEvent() {
    // INIT FILTERS
    this.grid.source.setFilter([], true, false);
    // INIT SORTING MODE
    this.grid.source.setSort([], false);
    // REFRESH DATA_SOURCE
    this.grid.source.refresh();
    // SEND EVENT TO DELETE FILTERS CONTENTS
    this.emitEventClearFilter();
  }

  /**
   * SEND EVENT TO INITIALIZE FILTERS CONTENTS
   */
  emitEventClearFilter() {
    this.eventsSubject.next();
  }
}
