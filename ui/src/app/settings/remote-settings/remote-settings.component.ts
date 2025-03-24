import { Component, Input } from '@angular/core';

export interface RemoteSettingsModel {
  index: number;
  name: string;
  isEnabled: boolean;
  serial: string;
  bitmask: string;
}

export function defaultRemoteSettings(index: number): RemoteSettingsModel {
  return {
    index: index,
    name: "",
    isEnabled: false,
    serial: "",
    bitmask: ""
  };
}

@Component({
  standalone: false,
  selector: 'app-remote-settings',
  templateUrl: './remote-settings.component.html',
  styleUrl: './remote-settings.component.scss'
})
export class RemoteSettingsComponent {
  @Input() model: RemoteSettingsModel = defaultRemoteSettings(-1);
}
