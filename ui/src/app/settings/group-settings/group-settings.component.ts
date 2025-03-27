import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BitmaskHelpDialog } from '../../shared/bitmask-help-dialog/bitmask-help-dialog.component';
import { BitmaskDialog } from '../../shared/bitmask-dialog/bitmask-dialog.component';

export interface GroupSettingsModel {
  index: number;
  name: string;
  isEnabled: boolean;
  bitmask: string;
}

export function defaultGroupSettings(index: number): GroupSettingsModel {
  return {
    index: index,
    name: "",
    isEnabled: false,
    bitmask: ""
  };
}

@Component({
  standalone: false,
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrl: './group-settings.component.scss'
})
export class GroupSettingsComponent {
  @Input() model: GroupSettingsModel = defaultGroupSettings(-1);

  readonly dialog = inject(MatDialog);

  onBitmaskHelpClicked() {
    this.dialog.open(BitmaskHelpDialog);
  }

  onBitmaskClick() {
    const dialogRef = this.dialog.open(BitmaskDialog);

    // TODO manage the shutters somewhere...
    dialogRef.componentInstance.shutters = [
      {
        index: 0,
        name: "testblabla",
        isEnabled: false
      },
      {
        index: 1,
        name: "wohnzimmer",
        isEnabled: true
      },
      {
        index: 2,
        name: "Bad",
        isEnabled: true
      },
      {
        index: 3,
        name: "Esszimmer",
        isEnabled: true
      },
    ];

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.model.bitmask = result;
      }
    });
  }
}
