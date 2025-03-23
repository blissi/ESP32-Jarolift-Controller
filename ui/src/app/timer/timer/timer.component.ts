import { Component, Input } from '@angular/core';

export interface TimerModel {
    timerIndex: number;
    isActive: boolean;
    type: number;
    time_value: string;
    offset_value: number;
    command: number;
    group_mask: string;
    
    use_min_time: boolean;
    min_time_value: string;

    use_max_time: boolean;
    max_time_value: string;
    
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}

export function defaultTimerModel(index: number): TimerModel {
  return {
    timerIndex: index,
    isActive: false,
    type: 0,
    time_value: "00:00",
    offset_value: 0,
    command: 0,
    group_mask: "",

    use_min_time: false,
    min_time_value: "00:00",
    
    use_max_time: false,
    max_time_value: "00:00",

    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  };
}


@Component({
  standalone: false,
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent {
  @Input() model: TimerModel = defaultTimerModel(-1);
}
