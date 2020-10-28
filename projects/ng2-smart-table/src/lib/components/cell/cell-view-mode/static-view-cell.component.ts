import {Component, Input, ChangeDetectionStrategy, OnInit} from '@angular/core';

import { Cell } from '../../../lib/data-set/cell';

@Component({
  selector: 'lib-table-cell-static-view-mode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngSwitch]="cell.getColumn().type">
      <lib-custom-view-component *ngSwitchCase="'custom'" [cell]="cell"></lib-custom-view-component>
      <div *ngSwitchCase="'html'" [innerHTML]="cell.getValue()"></div>
      <div *ngSwitchDefault>{{ cell.getValue() }}</div>
    </div>
  `,
})
export class StaticViewCellComponent {
  @Input() cell: Cell;
}
