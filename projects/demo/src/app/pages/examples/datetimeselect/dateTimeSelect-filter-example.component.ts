import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {LocalDataSource} from 'ng2-smart-table';

@Component({
  selector: 'app-date-time-select-example-filter',
  template: `
    <ng2-smart-table
      [settings]="settings"
      [source]="source"></ng2-smart-table>
  `,
})
export class DateTimeSelectFilterExampleComponent implements OnInit {
  settings = {};

  data = [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      notShownField: true,
      recDateTime: new Date('07/12/2021 12:10:12'),
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      notShownField: true,
      recDateTime: new Date('07/13/2021 08:13:45'),
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      username: 'Samantha',
      email: 'Nathan@yesenia.net',
      notShownField: false,
      recDateTime: new Date('07/14/2021 09:23:12'),
    },
    {
      id: 4,
      name: 'Patricia Lebsack',
      username: 'Karianne',
      email: 'Julianne.OConner@kory.org',
      notShownField: false,
      recDateTime: new Date('07/15/2021 03:43:14'),
    },
    {
      id: 5,
      name: 'Chelsey Dietrich',
      username: 'Kamren',
      email: 'Lucio_Hettinger@annie.ca',
      notShownField: false,
      recDateTime: new Date('07/16/2021 17:54:33'),
    },
    {
      id: 6,
      name: 'Mrs. Dennis Schulist',
      username: 'Leopoldo_Corkery',
      email: 'Karley_Dach@jasper.info',
      notShownField: false,
      recDateTime: new Date('07/17/2021 16:24:44'),
    },
    {
      id: 7,
      name: 'Kurtis Weissnat',
      username: 'Elwyn.Skiles',
      email: 'Telly.Hoeger@billy.biz',
      notShownField: false,
      recDateTime: new Date('07/18/2021 09:23:12'),
    },
    {
      id: 8,
      name: 'Nicholas Runolfsdottir V',
      username: 'Maxime_Nienow',
      email: 'Sherwood@rosamond.me',
      notShownField: true,
      recDateTime: new Date('07/19/2021 09:23:12'),
    },
    {
      id: 9,
      name: 'Glenna Reichert',
      username: 'Delphine',
      email: 'Chaim_McDermott@dana.io',
      notShownField: false,
      recDateTime: new Date('07/20/2021 09:23:12'),
    },
    {
      id: 10,
      name: 'Clementina DuBuque',
      username: 'Moriah.Stanton',
      email: 'Rey.Padberg@karina.biz',
      notShownField: false,
      recDateTime: new Date('07/22/2021 09:23'),
    },
    {
      id: 11,
      name: 'Nicholas DuBuque',
      username: 'Nicholas.Stanton',
      email: 'Rey.Padberg@rosamond.biz',
      notShownField: true,
      recDateTime: new Date('07/22/2021 09:23'),
    },
  ];


  source: LocalDataSource;
  isFilterInitialize = false;

  constructor() {
    this.source = new LocalDataSource(this.data);
  }


  ngOnInit(): void {
    this.settings = this.isFilterInitialize ? this.settings = this.getSettings(this.isFilterInitialize,
      'between', '2018-07-17', '2018-07-20') : this.settings = this.getSettings(this.isFilterInitialize);

  }
  getSettings(isFilterInitialize: boolean, selectedType?: string, value?: string, valueEnd?: string  ): any {
    return {
      language: 'fr',
      attr: {
        id: 'DateSelectFilterExampleComponent',
        rememberFilter: true,
        initializeFilter: isFilterInitialize
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
        recDateTime: {
          width: '20%',
          title: 'Date',
          valuePrepareFunction: date => {
            if (!date) {
              return date;
            }
            const raw = new Date(date);

            return new DatePipe('fr-FR').transform(raw, 'dd/MM/yyyy HH:mm:ss');
          },
          filter: {
            type: 'date-time',
            config : {
              selectType: selectedType,
              defaultValue: value,
              defaultEndValue : valueEnd
            }

          },
        },
      },
    };
  }
}
