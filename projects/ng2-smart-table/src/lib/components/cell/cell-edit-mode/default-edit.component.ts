import { Component } from '@angular/core';

import { EditCellDefaultComponent } from './edit-cell-default.component';

@Component({
  selector: 'lib-table-cell-default-editor',
  templateUrl: './default-edit.component.html',
})
export class DefaultEditComponent extends EditCellDefaultComponent {

  constructor() {
    super();
  }

  getEditorType(): string {
    return this.cell.getColumn().editor && this.cell.getColumn().editor.type;
  }
}
