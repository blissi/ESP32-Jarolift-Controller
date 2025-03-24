import { Component, Input } from '@angular/core';

export interface GroupSettingsModel {
  index: number;
  name: string;
  isEnabled: boolean;
  bitmask: string;
}

export function defaultGroupSettings(index: number): GroupSettingsModel {
  return {
    index: index,
    name: "",
    isEnabled: false,
    bitmask: ""
  };
}

@Component({
  standalone: false,
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
  styleUrl: './group-settings.component.scss'
})
export class GroupSettingsComponent {
  @Input() model: GroupSettingsModel = defaultGroupSettings(-1);
}
