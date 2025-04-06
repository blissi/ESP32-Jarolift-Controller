import { Component, Input } from '@angular/core';
import { Shutter } from '../../shutter';

@Component({
  standalone: false,
  selector: 'app-shutter-settings',
  templateUrl: './shutter-settings.component.html',
  styleUrl: './shutter-settings.component.scss'
})
export class ShutterSettingsComponent {
  @Input() model!: Shutter;
}
