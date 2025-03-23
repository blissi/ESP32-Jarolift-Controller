import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SystemPageComponent } from './system-page/system-page.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {path: "", component: SystemPageComponent }
];

@NgModule({
  declarations: [SystemPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ]
})
export class SystemModule { }
