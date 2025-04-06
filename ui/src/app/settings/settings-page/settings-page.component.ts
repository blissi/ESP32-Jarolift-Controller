import { Component, Signal } from '@angular/core';
import { AppState, AppStateService } from '../../app-state.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: false,
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  state: Signal<AppState | undefined>;

  constructor(appState: AppStateService) {
    this.state = toSignal(appState.$state);
  }


  // TODO create a model class...
  wifiUseStaticIPAddress: boolean = false;
  ethernetUseStaticIPAddress: boolean = false;
}