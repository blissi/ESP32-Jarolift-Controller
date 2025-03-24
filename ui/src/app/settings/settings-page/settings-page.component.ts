import { Component } from '@angular/core';
import { defaultShutterSettings, ShutterSettingsModel } from '../shutter-settings/shutter-settings.component';
import { defaultRemoteSettings, RemoteSettingsModel } from '../remote-settings/remote-settings.component';
import { defaultGroupSettings, GroupSettingsModel } from '../group-settings/group-settings.component';

@Component({
  standalone: false,
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  shutters: ShutterSettingsModel[] = Array.from({length: 16}, (v, k) => defaultShutterSettings(k));
  remotes: RemoteSettingsModel[] = Array.from({length: 16}, (v, k) => defaultRemoteSettings(k));
  groups: GroupSettingsModel[] = Array.from({length: 6}, (v, k) => defaultGroupSettings(k));
}