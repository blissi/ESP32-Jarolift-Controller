import { Component, inject, Input, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BitmaskHelpDialog } from '../../shared/bitmask-help-dialog/bitmask-help-dialog.component';
import { BitmaskDialog } from '../../shared/bitmask-dialog/bitmask-dialog.component';
import { AppState, AppStateService } from '../../app-state.service';
import { toSignal } from '@angular/core/rxjs-interop';

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
  state: Signal<AppState | undefined>;

  constructor(appState: AppStateService, private dialog: MatDialog) {
    this.state = toSignal(appState.$state);
  }

  @Input() model: GroupSettingsModel = defaultGroupSettings(-1);

  onBitmaskHelpClicked() {
    this.dialog.open(BitmaskHelpDialog);
  }

  onBitmaskClick() {
    const dialogRef = this.dialog.open(BitmaskDialog);

    // TODO manage the shutters somewhere...
    dialogRef.componentInstance.bitStates = this.state()!.shutters.map(x => { return {
      shutter: x,
      isChecked: false
    }});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.model.bitmask = result;
      }
    });
  }
}
