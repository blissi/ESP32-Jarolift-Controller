import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ShutterSettingsModel } from '../../settings/shutter-settings/shutter-settings.component';
import { DialogRef } from '@angular/cdk/dialog';

interface BitStateModel {
  shutter: ShutterSettingsModel;
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

  @Input() shutters!: ShutterSettingsModel[];

  bitStates!: BitStateModel[];

  ngOnInit() {
    this.bitStates = this.shutters
      .filter(x => x.isEnabled)
      .map((x, i) => {
        return {
          shutter: x,
          isChecked: false
        }
      });
  }

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
