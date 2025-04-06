import { Component, Signal } from '@angular/core';
import { AppState, AppStateService } from '../../app-state.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: false,
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrl: './group-page.component.scss'
})
export class GroupPageComponent {
  state: Signal<AppState | undefined>;

  constructor(appState: AppStateService) {
    this.state = toSignal(appState.$state);
  }
}
