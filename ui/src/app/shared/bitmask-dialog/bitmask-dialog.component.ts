import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Shutter } from '../../shutter';


interface BitStateModel {
  shutter: Shutter;
  isChecked: boolean;
}


@Component({
  standalone: false,
  selector: 'app-bitmask-dialog',
  templateUrl: './bitmask-dialog.component.html'
})
export class BitmaskDialog {
  constructor(private dialogRef: MatDialogRef<BitmaskDialog>) {
  }

  bitStates!: BitStateModel[];

  public onApply(): void {
    let bitmask = 0;
    for (let bitState of this.bitStates) {
      if (bitState.isChecked) {
        bitmask |= 1 << bitState.shutter.index;
      }
    }

    const bitmaskString = bitmask.toString(2).padStart(16, "0");
    this.dialogRef.close(bitmaskString);
  }
}
