import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BitmaskHelpDialog } from './bitmask-help-dialog/bitmask-help-dialog.component';
import { BitmaskDialog } from './bitmask-dialog/bitmask-dialog.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BitmaskHelpDialog,
    BitmaskDialog
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
  ]
})
export class SharedModule { }
