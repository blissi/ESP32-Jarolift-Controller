import { Component, Input } from '@angular/core';
import { Remote } from '../../remote';


@Component({
  standalone: false,
  selector: 'app-remote-settings',
  templateUrl: './remote-settings.component.html',
  styleUrl: './remote-settings.component.scss'
})
export class RemoteSettingsComponent {
  @Input() model!: Remote;
}
