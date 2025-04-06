import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Shutter } from './shutter';
import { CommunicationService } from './communication.service';
import { ShutterGroup } from './shutter-group';
import { Remote } from './remote';


export interface AppState {
  shutters: Shutter[];
  remotes: Remote[];
  groups: ShutterGroup[];
}


@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  $state: Observable<AppState>;

  constructor(comm: CommunicationService) {
    this.$state = of({
      shutters: Array.from({ length: 16 }, (v, k) => new Shutter(comm, k)),
      remotes: Array.from({ length: 16 }, (v, k) => new Remote(comm, k)),
      groups: Array.from({ length: 6 }, (v, k) => new ShutterGroup(comm, k))
    });
  }
}
