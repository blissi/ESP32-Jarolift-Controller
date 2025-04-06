import { Component, inject, Signal } from '@angular/core';
import { AppState, AppStateService } from '../../app-state.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: false,
  selector: 'app-service-page',
  templateUrl: './service-page.component.html',
  styleUrl: './service-page.component.scss'
})
export class ServicePageComponent {
  state: Signal<AppState | undefined>;

  constructor(appState: AppStateService) {
    this.state = toSignal(appState.$state);
  }
}
