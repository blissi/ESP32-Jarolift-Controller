import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TimerPageComponent } from './timer-page/timer-page.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {path: "", component: TimerPageComponent }
];

@NgModule({
  declarations: [TimerPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ]
})
export class TimerModule { }
