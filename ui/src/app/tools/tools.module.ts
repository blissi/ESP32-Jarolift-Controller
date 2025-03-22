import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TimerPageComponent } from '../timer/timer-page/timer-page.component';
import { ToolsPageComponent } from './tools-page/tools-page.component';

const routes: Routes = [
  {path: "", component: ToolsPageComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ToolsModule { }
