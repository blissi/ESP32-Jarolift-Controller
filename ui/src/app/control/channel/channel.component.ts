import { Component, Input } from '@angular/core';
import { Shutter } from '../../shutter';

@Component({
  standalone: false,
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {
  @Input() shutter!: Shutter;
}
