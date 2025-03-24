import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { ShutterSettingsComponent } from './shutter-settings/shutter-settings.component';
import { RemoteSettingsComponent } from './remote-settings/remote-settings.component';
import { GroupSettingsComponent } from './group-settings/group-settings.component';

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
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ]
})
export class SettingsModule { }
