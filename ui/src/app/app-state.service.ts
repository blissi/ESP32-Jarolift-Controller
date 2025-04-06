import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { defaultShutterSettings, ShutterSettingsModel } from './settings/shutter-settings/shutter-settings.component';
import { defaultRemoteSettings, RemoteSettingsModel } from './settings/remote-settings/remote-settings.component';
import { defaultGroupSettings, GroupSettingsModel } from './settings/group-settings/group-settings.component';


export interface AppState {
  shutters: ShutterSettingsModel[];
  remotes: RemoteSettingsModel[];
  groups: GroupSettingsModel[];
}


@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  $state: Observable<AppState>;

  constructor() {
    this.$state = of({
      shutters: Array.from({ length: 16 }, (v, k) => defaultShutterSettings(k)),
      remotes: Array.from({ length: 16 }, (v, k) => defaultRemoteSettings(k)),
      groups: Array.from({ length: 6 }, (v, k) => defaultGroupSettings(k))
    });
  }
}
