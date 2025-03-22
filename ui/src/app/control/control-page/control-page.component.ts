import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-control-page',
  templateUrl: './control-page.component.html',
  styleUrl: './control-page.component.scss'
})
export class ControlPageComponent {
  channels: number[] = [0, 1, 2, 3, 4];
}
