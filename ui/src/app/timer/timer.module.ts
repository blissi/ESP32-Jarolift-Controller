import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TimerPageComponent } from './timer-page/timer-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { TimerComponent } from './timer/timer.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {path: "", component: TimerPageComponent }
];

@NgModule({
  declarations: [TimerPageComponent, TimerComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ]
})
export class TimerModule { }
