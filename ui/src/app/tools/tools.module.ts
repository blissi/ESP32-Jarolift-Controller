import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ToolsPageComponent } from './tools-page/tools-page.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {path: "", component: ToolsPageComponent }
];

@NgModule({
  declarations: [ToolsPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ]
})
export class ToolsModule { }
