import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BitmaskHelpDialog } from './bitmask-help-dialog/bitmask-help-dialog.component';
import { BitmaskDialog } from './bitmask-dialog/bitmask-dialog.component';
import { FormsModule } from '@angular/forms';
import { NTPHelpDialog } from './ntp-help-dialog/ntp-help-dialog.component';
import { OpenConfigDialog } from './open-config-dialog/open-config-dialog.component';
import { OtaUpdateDoneDialog } from './ota-update-done-dialog/ota-update-done-dialog.component';
import { OtaUpdateFailedDialog } from './ota-update-failed-dialog/ota-update-failed-dialog.component';
import { VersionDialog } from './version-dialog/version-dialog.component';


@NgModule({
  declarations: [
    BitmaskHelpDialog,
    BitmaskDialog,
    NTPHelpDialog,
    OpenConfigDialog,
    OtaUpdateDoneDialog,
    OtaUpdateFailedDialog,
    VersionDialog
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MatDialogModule,
    FormsModule
  ],
  exports: [
    BitmaskHelpDialog,
    BitmaskDialog,
    NTPHelpDialog,
    OpenConfigDialog,
    OtaUpdateDoneDialog,
    OtaUpdateFailedDialog,
    VersionDialog
  ]
})
export class SharedModule { }
