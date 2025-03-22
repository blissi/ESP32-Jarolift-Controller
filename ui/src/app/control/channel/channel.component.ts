import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {
  @Input() channelIndex: number = 0;  
}
