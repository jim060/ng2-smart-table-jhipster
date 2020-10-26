import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Cell } from '../../../lib/data-set/cell';

@Component({
  selector: 'lib-table-cell-edit-mode',
  template: `
    <div [ngSwitch]="getEditorType()">
      <lib-table-cell-custom-editor *ngSwitchCase="'custom'"
                                    [cell]="cell"
                                    [inputClass]="inputClass"
                                    (edited)="onEdited($event)">
      </lib-table-cell-custom-editor>
      <lib-table-cell-default-editor *ngSwitchDefault
                                     [cell]="cell"
                                     [inputClass]="inputClass"
                                     (edited)="onEdited($event)">
      </lib-table-cell-default-editor>
    </div>
  `,
})
export class EditCellComponent {

  @Input() cell: Cell;
  @Input() inputClass = '';

  @Output() edited = new EventEmitter<any>();

  onEdited(event: any): boolean {
    this.edited.next(event);
    return false;
  }
  getEditorType(): string {
    return this.cell.getColumn().editor && this.cell.getColumn().editor.type;
  }
}
