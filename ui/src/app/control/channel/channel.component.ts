import { Component, Input } from '@angular/core';
import { ShutterSettingsModel } from '../../settings/shutter-settings/shutter-settings.component';

@Component({
  standalone: false,
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {
  @Input() shutter!: ShutterSettingsModel;
}
