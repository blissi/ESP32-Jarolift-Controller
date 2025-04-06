import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { ShutterSettingsComponent } from './shutter-settings/shutter-settings.component';
import { RemoteSettingsComponent } from './remote-settings/remote-settings.component';
import { GroupSettingsComponent } from './group-settings/group-settings.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SendDataDirective } from '../send-data.directive';

const routes: Routes = [
  {path: "", component: SettingsPageComponent }
];

@NgModule({
  declarations: [
    SettingsPageComponent,
    ShutterSettingsComponent,
    RemoteSettingsComponent,
    GroupSettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    MatDialogModule,
    SharedModule,
    SendDataDirective
  ]
})
export class SettingsModule { }
