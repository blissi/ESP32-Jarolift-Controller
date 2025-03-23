import { Component } from '@angular/core';
import { defaultTimerModel, TimerModel } from '../timer/timer.component';

@Component({
  standalone: false,
  selector: 'app-timer-page',
  templateUrl: './timer-page.component.html',
  styleUrl: './timer-page.component.scss'
})
export class TimerPageComponent {
  timers: TimerModel[] = Array.from({length: 6}, (v, k) => defaultTimerModel(k));
}
