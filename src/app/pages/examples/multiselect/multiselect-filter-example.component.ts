import { Component } from '@angular/core';

import { LocalDataSource } from '../../../../ng2-smart-table';

@Component({
  selector: 'multiselect-example-filter',
  template: `
    <ng2-smart-table
      [settings]="settings"
      [source]="source"></ng2-smart-table>
  `,
})
export class MultiselectFilterExampleComponent {
  test = [];
  settings = {
    language: 'fr',
    attr: {
      id: 'MultiselectFilterExampleComponent',
      rememberFilter: true
    },
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      id: {
        width: '20%',
        title: 'ID',
      },
      name: {
        width: '20%',
        title: 'Full Name',
      },
      username: {
        width: '20%',
        title: 'User Name',
      },
      email: {
        width: '20%',
        title: 'Email',
      },
      recProduit: {
        width: '20%',
        title: 'Produit',
        filter: {
          type: 'multiple',
          config: {
            dropdownList: [
              { id: '1', itemName: 'Produit 1' },
              { id: '2', itemName: 'Produit 2' },
              { id: '3', itemName: 'Produit 3' },
              { id: '4', itemName: 'Produit 4' },
            ],
            selectedItems: [],
            dropdownSettings: {
              singleSelection: false,
              text: 'Produit',
              enableSearchFilter: true,
              classes: 'myclass custom-class'
            }
          },
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
    },
  };

  data = [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      notShownField: true,
      recProduit: 'Produit 1'
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      notShownField: true,
      recProduit: 'Produit 1'
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      username: 'Samantha',
      email: 'Nathan@yesenia.net',
      notShownField: false,
      recProduit: 'Produit 2'
    },
    {
      id: 4,
      name: 'Patricia Lebsack',
      username: 'Karianne',
      email: 'Julianne.OConner@kory.org',
      notShownField: false,
      recProduit: 'Produit 2'
    },
    {
      id: 5,
      name: 'Chelsey Dietrich',
      username: 'Kamren',
      email: 'Lucio_Hettinger@annie.ca',
      notShownField: false,
      recProduit: 'Produit 2'
    },
    {
      id: 6,
      name: 'Mrs. Dennis Schulist',
      username: 'Leopoldo_Corkery',
      email: 'Karley_Dach@jasper.info',
      notShownField: false,
      recProduit: 'Produit 3'
    },
    {
      id: 7,
      name: 'Kurtis Weissnat',
      username: 'Elwyn.Skiles',
      email: 'Telly.Hoeger@billy.biz',
      notShownField: false,
      recProduit: 'Produit 3'
    },
    {
      id: 8,
      name: 'Nicholas Runolfsdottir V',
      username: 'Maxime_Nienow',
      email: 'Sherwood@rosamond.me',
      notShownField: true,
      recProduit: 'Produit 3'
    },
    {
      id: 9,
      name: 'Glenna Reichert',
      username: 'Delphine',
      email: 'Chaim_McDermott@dana.io',
      notShownField: false,
      recProduit: 'Produit 3'
    },
    {
      id: 10,
      name: 'Clementina DuBuque',
      username: 'Moriah.Stanton',
      email: 'Rey.Padberg@karina.biz',
      notShownField: false,
      recProduit: 'Produit 4'
    },
    {
      id: 11,
      name: 'Nicholas DuBuque',
      username: 'Nicholas.Stanton',
      email: 'Rey.Padberg@rosamond.biz',
      notShownField: true,
      recProduit: 'Produit 4'
    }
  ];

  source: LocalDataSource;

  constructor() {
    this.source = new LocalDataSource(this.data);
  }
}
