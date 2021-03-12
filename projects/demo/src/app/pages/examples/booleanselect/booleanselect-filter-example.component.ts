import {Component, OnInit} from '@angular/core';

import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-boolean-select-example-filter',
  template: `
    <ng2-smart-table
      [settings]="settings"
      [source]="source"></ng2-smart-table>
  `,
})
export class BooleanSelectFilterExampleComponent implements OnInit {
  settings: any;
  data = [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      notShownField: true,
      active: true
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      notShownField: true,
      active: false
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      username: 'Samantha',
      email: 'Nathan@yesenia.net',
      notShownField: false,
      active: false
    },
    {
      id: 4,
      name: 'Patricia Lebsack',
      username: 'Karianne',
      email: 'Julianne.OConner@kory.org',
      notShownField: false,
      active: false
    },
    {
      id: 5,
      name: 'Chelsey Dietrich',
      username: 'Kamren',
      email: 'Lucio_Hettinger@annie.ca',
      notShownField: false,
      active: true
    },
    {
      id: 6,
      name: 'Mrs. Dennis Schulist',
      username: 'Leopoldo_Corkery',
      email: 'Karley_Dach@jasper.info',
      notShownField: false,
      active: true
    },
    {
      id: 7,
      name: 'Kurtis Weissnat',
      username: 'Elwyn.Skiles',
      email: 'Telly.Hoeger@billy.biz',
      notShownField: false,
      active: true
    },
    {
      id: 8,
      name: 'Nicholas Runolfsdottir V',
      username: 'Maxime_Nienow',
      email: 'Sherwood@rosamond.me',
      notShownField: true,
      active: false
    },
    {
      id: 9,
      name: 'Glenna Reichert',
      username: 'Delphine',
      email: 'Chaim_McDermott@dana.io',
      notShownField: false,
      active: false
    },
    {
      id: 10,
      name: 'Clementina DuBuque',
      username: 'Moriah.Stanton',
      email: 'Rey.Padberg@karina.biz',
      notShownField: false,
      active: true
    },
    {
      id: 11,
      name: 'Nicholas DuBuque',
      username: 'Nicholas.Stanton',
      email: 'Rey.Padberg@rosamond.biz',
      notShownField: true,
      active: false
    }
  ];

  source: LocalDataSource;
  isFilterInitialize = false;
  constructor() {
    this.source = new LocalDataSource(this.data);
  }

  filterValues = [{id: '3', itemName: 'Produit 3'}, {id: '2', itemName: 'Produit 2'}, {id: '1', itemName: 'Produit 1'}];
  ngOnInit(): void {
    const mySubList = this.filterValues.filter(element => 'Produit 1;Produit 2'.includes(element.itemName));

    this.settings = this.isFilterInitialize ? this.settings = this.getSettings(this.isFilterInitialize, mySubList) :
      this.settings = this.getSettings(this.isFilterInitialize);
  }
  getSettings(isFilterInitialize: boolean, valuesList?: any): any {
    return {
      language: 'fr',
      attr: {
        id: 'booleanSelectFilterExampleComponent',
        rememberFilter: true,
        buttonFilterInitText: 'Initialize Filters & Sort',
        initializeFilter: isFilterInitialize,
      },
      actions: {
        add: false,
        edit: false,
        delete: false
      },
      columns: {
        id: {
          width: '15%',
          title: 'ID',
        },
        name: {
          width: '15%',
          title: 'Full Name',
        },
        username: {
          width: '15%',
          title: 'User Name',
        },
        email: {
          width: '15%',
          title: 'Email'
        },
        active: {
          width: '15%',
          title: 'Active',
          valuePrepareFunction: (value: boolean) => {
            return value === true ? 'Oui' : 'Non';
          },
          filter: {
            type: 'list',
            config: {
              list: [
                { value: true, title: 'Oui' },
                { value: false, title: 'Non' }
              ]},
            /* filterFunction(cell?: any, search?: string): boolean {
              const listSearch = search.split(';');
              const value = cell.replace(/ /g, '');
              if (listSearch.includes(value)) {
                return true;
              } else {
                return false;
              }
            } */
          },
        },
        buttonVarImportance: {
          title: 'BTN',
          width: '25%',
          hidden: true,
          filter: {type: 'custom-column'}
        },
      },
    };
  }
}
