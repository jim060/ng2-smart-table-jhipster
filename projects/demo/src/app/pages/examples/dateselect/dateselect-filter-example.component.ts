import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'dateselect-example-filter',
  template: `
    <ng2-smart-table
      [settings]="settings"
      [source]="source"></ng2-smart-table>
  `,
})
export class DateselectFilterExampleComponent {
  test = [];
  settings = {
    language: 'fr',
    attr: {
      id: 'DateselectFilterExampleComponent',
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
      recDate: {
        width: '20%',
        title: 'Date',
        valuePrepareFunction: date => {
          if (!date) {
            return date;
          }
          const raw = new Date(date);

          const formatted = new DatePipe('fr-FR').transform(raw, 'dd/MM/yyyy');
          return formatted;
        },
        filter: {
          type: 'date',
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
      recDate: new Date('07/12/2018'),
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      notShownField: true,
      recDate: new Date('07/13/2018'),
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      username: 'Samantha',
      email: 'Nathan@yesenia.net',
      notShownField: false,
      recDate: new Date('07/14/2018'),
    },
    {
      id: 4,
      name: 'Patricia Lebsack',
      username: 'Karianne',
      email: 'Julianne.OConner@kory.org',
      notShownField: false,
      recDate: new Date('07/15/2018'),
    },
    {
      id: 5,
      name: 'Chelsey Dietrich',
      username: 'Kamren',
      email: 'Lucio_Hettinger@annie.ca',
      notShownField: false,
      recDate: new Date('07/16/2018'),
    },
    {
      id: 6,
      name: 'Mrs. Dennis Schulist',
      username: 'Leopoldo_Corkery',
      email: 'Karley_Dach@jasper.info',
      notShownField: false,
      recDate: new Date('07/17/2018'),
    },
    {
      id: 7,
      name: 'Kurtis Weissnat',
      username: 'Elwyn.Skiles',
      email: 'Telly.Hoeger@billy.biz',
      notShownField: false,
      recDate: new Date('07/18/2018'),
    },
    {
      id: 8,
      name: 'Nicholas Runolfsdottir V',
      username: 'Maxime_Nienow',
      email: 'Sherwood@rosamond.me',
      notShownField: true,
      recDate: new Date('07/19/2018'),
    },
    {
      id: 9,
      name: 'Glenna Reichert',
      username: 'Delphine',
      email: 'Chaim_McDermott@dana.io',
      notShownField: false,
      recDate: new Date('07/22/2018'),
    },
    {
      id: 10,
      name: 'Clementina DuBuque',
      username: 'Moriah.Stanton',
      email: 'Rey.Padberg@karina.biz',
      notShownField: false,
      recDate: new Date('07/22/2018'),
    },
    {
      id: 11,
      name: 'Nicholas DuBuque',
      username: 'Nicholas.Stanton',
      email: 'Rey.Padberg@rosamond.biz',
      notShownField: true,
      recDate: new Date('07/22/2018'),
    },
  ];

  source: LocalDataSource;

  constructor() {
    this.source = new LocalDataSource(this.data);
  }
}
