import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {path: "", component: SettingsPageComponent }
];

@NgModule({
  declarations: [SettingsPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ]
})
export class SettingsModule { }
