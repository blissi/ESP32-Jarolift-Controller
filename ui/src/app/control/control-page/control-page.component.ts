import { Component, Signal } from '@angular/core';
import { AppState, AppStateService } from '../../app-state.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: false,
  selector: 'app-control-page',
  templateUrl: './control-page.component.html',
  styleUrl: './control-page.component.scss'
})
export class ControlPageComponent {
  state: Signal<AppState | undefined>;

  constructor(appState: AppStateService) {
    this.state = toSignal(appState.$state);
  }
}
